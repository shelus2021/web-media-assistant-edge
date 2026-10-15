# Microsoft Edge 扩展商店提交说明

## 上传文件

上传项目根目录中的 `WebMediaAssistant-edge-store-0.1.38.zip`。不要上传 CRX、PEM、源码目录或 `tools` 目录。

包内清单版本为 Manifest V3，扩展版本为 0.1.38。`manifest.json` 位于 ZIP 根目录。

## 商店描述（中文）

网页媒体助手将播放控制、媒体检索和悬停图片预览整合到一个扩展中。播放控制支持调整网页音视频速度、快进、后退以及自定义快捷键；媒体检索可以列出当前页面实际请求的音频、视频和 HLS 播放列表，并支持复制地址、直接下载以及在支持的点播流上合并分片；图片预览基于内置的 Imagus 站点规则，在鼠标悬停时查找更清晰的原图或动画。三个功能均可独立启用，适合课程视频、长视频、网页图片浏览以及排查页面媒体资源等场景。扩展不包含广告、遥测、远程可执行代码或项目自建的数据上传服务，设置和临时检索结果保存在浏览器扩展存储中。HLS 合并仅面向非 DRM 点播内容，直播、受保护媒体或被网站限制的资源可能无法下载。

## Store description (English)

Web Media Assistant combines playback controls, media discovery, and hover image previews in one extension. Playback controls provide speed adjustment, seeking, an on-page controller, and customizable keyboard shortcuts. Media discovery lists audio, video, and HLS playlists requested by the current page and supports URL copying, direct downloads, and segment merging for supported on-demand streams. Image preview uses bundled Imagus site rules to locate larger images and animations when the pointer hovers over a supported target. Each feature can be enabled independently. The extension contains no advertising, telemetry, or project-operated upload service. Settings and temporary discovery results remain in browser extension storage.

## 权限用途

- `storage`：保存用户设置、图片规则和临时媒体检索结果。
- `tabs`：识别当前标签页、按标签页归类媒体结果并更新弹窗。
- `webRequest`：只观察网页响应，用于发现页面实际加载的媒体资源。
- `downloads`：仅在用户点击下载或图片保存后创建浏览器下载。
- `clipboardWrite`：在用户点击复制按钮后复制媒体网址。
- `alarms`：定期清理已经关闭标签页的临时媒体数据。
- `offscreen`：在弹窗关闭后继续处理用户主动开始的 HLS 合并任务。
- `declarativeNetRequestWithHostAccess`：HLS 下载期间为对应分片临时设置来源请求头；任务请求结束后立即删除会话规则。
- `<all_urls>`：三个功能需要在用户访问的网站上控制媒体、观察媒体请求和解析悬停图片。

## 隐私与素材

- 隐私政策 URL：`https://github.com/shelus2021/web-media-assistant-edge/blob/main/PRIVACY.md`
- README 预览使用源码目录下的 `screenshots/1.png` 至 `screenshots/4.png`。Edge 商店截图为可选项；若提交，需另行制作成 640×480 或 1280×800，不能直接上传当前不同尺寸的原图。
- 商店图标可使用 `icons/icon128.png`。

## Partner Center 隐私选项

- 远程代码：选择“否”。扩展的可执行代码均包含在 ZIP 内；运行时访问网页和媒体地址不等于下载并执行远程代码。
- 数据使用：按实际行为披露网页浏览活动／网站内容访问。扩展只为用户可见的媒体功能在本机处理这些数据，不发送到项目运营的服务器。
- 单一用途：帮助用户在网页中控制、查找、预览和保存媒体内容。

## 发布前权利确认

本项目包含 Imagus 衍生文件，其上游并非 MIT 许可。提交人必须自行确认已获得在 Microsoft Edge 扩展商店及公开源码仓库中再分发这些文件的权利；`THIRD_PARTY_NOTICES.md` 仅用于披露来源，不能替代授权。

## 审核测试说明

1. 安装后打开任意包含 HTML5 视频的网页，通过扩展菜单启用播放控制并测试速度快捷键。
2. 打开包含普通图片链接的网页，将鼠标悬停在图片上测试图片预览。
3. 在扩展菜单中启用媒体检索，刷新包含音视频的网页，然后打开“媒体检索”查看捕获结果。
4. HLS 合并只支持非 DRM 的点播播放列表；直播、DRM 以及网站拒绝跨域访问时会显示错误，而不会上传媒体或用户数据。
