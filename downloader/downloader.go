package downloader

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"regexp"
	"time"

	"github.com/kkdai/youtube/v2"
)

type ProgressMonitoring struct {
	Percentage string `json:"percentage"`
	Speed      string `json:"speed"`
}

type Downloader struct {
	IsDownloading bool
	videoSize     int64
	file          io.Writer
	bytesWritten  int64
}

func (dl *Downloader) setDownloadingState() {
	dl.videoSize = 0
	dl.bytesWritten = 0
	dl.IsDownloading = true
}

func (dl *Downloader) Write(p []byte) (int, error) {
	n, err := dl.file.Write(p)
	if err != nil {
		log.Println(err)
		return n, err
	}
	dl.bytesWritten += int64(n)
	return n, nil
}

func (dl *Downloader) UpdateProgressBar(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	fmt.Println("Progress bar update started")

	progress := ProgressMonitoring{}

	bytesWritten := int64(0)
	for {
		if !dl.IsDownloading {
			progress.Percentage = "100"
			progress.Speed = "download finished"

			progressJson, err := json.Marshal(progress)
			if err != nil {
				report := fmt.Sprintf("%v", err)
				w.WriteHeader(http.StatusNotAcceptable)
				w.Write([]byte(report))
				w.(http.Flusher).Flush()
				return
			}

			sseMessage := fmt.Sprintf("data: %s\n\n", progressJson)

			w.Write([]byte(sseMessage))
			w.(http.Flusher).Flush()

			fmt.Println("Progress bar update stopped")
			break
		}

		time.Sleep(1000 * time.Millisecond)

		speed := dl.bytesWritten - int64(bytesWritten)
		speed_mb := float64(speed) / 1_000_000

		bytesWritten = dl.bytesWritten

		percentage := (float64(dl.bytesWritten) / float64(dl.videoSize)) * 100
		fmt.Printf("%v - BYTES WRITTEN; %v - VIDEO SIZE; PROGRESS %.1f%%; SPEED %.1f MB/s\n", dl.bytesWritten, dl.videoSize, percentage, speed_mb)

		progress.Speed = fmt.Sprintf("%.1f", speed_mb)
		progress.Percentage = fmt.Sprintf("%d", int(percentage))

		progressJson, err := json.Marshal(progress)
		if err != nil {
			report := fmt.Sprintf("%v", err)
			w.WriteHeader(http.StatusNotAcceptable)
			w.Write([]byte(report))
			w.(http.Flusher).Flush()
			return
		}

		sseMessage := fmt.Sprintf("data: %s\n\n", progressJson)

		w.Write([]byte(sseMessage))
		w.(http.Flusher).Flush()
	}
}

func (dl *Downloader) StartDownload(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		decoder := json.NewDecoder(r.Body)
		var json map[string]string
		if err := decoder.Decode(&json); err != nil {
			http.Error(w, "Invalid JSON data", http.StatusBadRequest)
			return
		}

		videoID := json["videoID"]

		if err := dl.Download(videoID); err != nil {
			report := fmt.Sprintf("%v", err)
			w.WriteHeader(http.StatusNotAcceptable)
			w.Write([]byte(report))
			w.(http.Flusher).Flush()
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Video downloaded successfully!"))
		w.(http.Flusher).Flush()
	}
}

func (dl *Downloader) Download(videoID string) error {

	dl.setDownloadingState()

	client := youtube.Client{}
	video, err := client.GetVideo(videoID)
	if err != nil {
		log.Println("Error: ", err)
		return errors.New("error getting video id")
	}

	formats := video.Formats.WithAudioChannels() // only get videos with audio

	// formats are sorted in a way that the 1st format in the list has the best quality(720p max if with audio channels)
	stream, size, err := client.GetStream(video, &formats[0])
	if err != nil {
		log.Println("Error: ", err)
		return errors.New("error getting stream")
	}

	dl.videoSize = size

	videoTitle := video.Title
	re := regexp.MustCompile(`[\\/:"*?<>|]`)
	fileName := re.ReplaceAllString(videoTitle, "")

	file, err := os.Create(fileName + ".mp4")
	if err != nil {
		log.Println("Error: ", err)
		return errors.New("error creating video file")
	}
	defer file.Close()

	dl.file = file

	_, err = io.Copy(dl, stream)
	if err != nil {
		log.Println("Error: ", err)
		return errors.New("error copying from the stream")
	}

	dl.IsDownloading = false

	return nil
}
