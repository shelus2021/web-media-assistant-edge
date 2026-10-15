# 隐私政策 / Privacy Policy

最后更新 / Last updated: 2026-10-15

## 中文

网页媒体助手不包含广告、遥测、分析工具或由本项目运营的数据上传服务器。扩展不会出售用户数据，也不会将网页浏览记录提供给开发者。

为提供播放控制、媒体检索和悬停图片预览，扩展会在用户访问的网页中读取媒体元素、观察网页发出的媒体请求，并按图片解析规则访问目标图片、网页或第三方公开接口。相关网络请求会直接发送给目标网站；目标网站可能按照自己的隐私政策接收 IP 地址、Cookie 等常规请求信息，本项目不会从这些网站收集该信息。

扩展设置、图片规则以及媒体检索结果保存在 Microsoft Edge 的本地扩展存储中。媒体检索结果可能包含当前页面请求的媒体网址。扩展不会在项目服务器上保存这些数据；关闭相关标签页后会定期清理临时媒体结果。用户可以在扩展设置中重置数据，或通过 Microsoft Edge 移除扩展及其本地数据。

只有用户主动点击下载或保存时，扩展才会调用 Microsoft Edge 下载功能。旧版 Imagus 的“发送图片”服务未包含在本扩展中。

如本政策随功能变化而更新，最新版将发布在本仓库的 `PRIVACY.md`。隐私问题可通过本仓库的 GitHub Issues 联系维护者。

## English

Web Media Assistant contains no advertising, telemetry, analytics, or project-operated upload server. It does not sell user data or provide browsing history to the developer.

To provide playback controls, media discovery, and hover image previews, the extension reads media elements on pages the user visits, observes media requests made by those pages, and may contact target images, pages, or third-party public endpoints selected by bundled resolver rules. These requests are sent directly to the destination site. That site may receive ordinary request information such as the user's IP address and cookies under its own privacy policy; this project does not collect that information from the site.

Extension settings, image rules, and media discovery results are stored in Microsoft Edge's local extension storage. Discovery results may include media URLs requested by the current page. These data are not stored on a project-operated server. Temporary media results are periodically removed after the related tab is closed. Users can reset extension data in the extension settings, or remove the extension and its local data through Microsoft Edge.

The extension invokes Microsoft Edge downloads only after the user chooses to download or save content. The legacy Imagus “send image” services are not included.

If functionality changes, the current policy will be published in this repository as `PRIVACY.md`. Privacy questions can be sent to the maintainers through this repository's GitHub Issues.
