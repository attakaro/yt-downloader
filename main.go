package main

import (
	"embed"
	"io/fs"
	"net/http"
	downloader "yt-downloader/downloader"

	webview "github.com/webview/webview_go"
)

//go:embed ui
var content embed.FS

func fileServer() http.Handler {
	ui := fs.FS(content)
	ctx, _ := fs.Sub(ui, "ui")
	return http.FileServer(http.FS(ctx))
}

func windowRun() {
	w := webview.New(false)
	defer w.Destroy()
	w.SetTitle("yt-downloader")
	w.SetSize(500, 300, webview.HintFixed)
	w.Navigate("http://localhost:8080")
	w.Run()
}

func main() {
	yt_dl := downloader.Downloader{
		IsDownloading: false,
	}

	http.Handle("/", fileServer())

	http.HandleFunc("/progress", yt_dl.UpdateProgressBar)
	http.HandleFunc("/download", yt_dl.StartDownload)

	go func() {
		http.ListenAndServe(":8080", nil)
	}()
	windowRun()
}
