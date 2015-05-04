預裝程序
=======

## 終端機篇

在 Mac 上必須預先安裝好 Node.js（含 NPM 套件管理）、Homebrew、Git 以及 Command Line Tools for Xcode，以及製書需要使用的 Pandoc 與 Kindlegen。

### Command Line Tools for Xcode

即使沒有安裝完整 Xcode，仍然可以在終端機輸入 `xcode-select --install` 進行安裝。如果已經安裝了 Xcode，也要進入設定選項確認是否有勾選下載安裝 Command Line Tools。

安裝之後，升級都會出現在 Mac App Store。

### Homebrew

Mac 上最好用的套件安裝與管理工具，參考[官網](http://brew.sh/index_zh-tw.html)說明，拷貝安裝指令到終端機，依照指示完成安裝即可。

平日三不五時在終端機輸入 `brew update && brew upgrade` 即可自動更新。

### Git

在終端機輸入 `brew install git`。

> 如果不使用 Git 安裝 NVM 的方法，也並不一定需要

### Node.js

在 Mac 上安裝 Node.js 的方式是透過 [NVM](https://github.com/creationix/nvm)，可以透過 Homebrew 安裝，但似乎問題比較多，推薦的方式是直接用 Git 安裝。

1. 打開終端機輸入 `git clone https://github.com/creationix/nvm.git ~/.nvm`，將 nvm 擺放在個人家目錄下的隱藏目錄。
2. 進入該目錄 `cd ~/.nvm`。
3. 接著輸入

    git checkout \`git describe --abbrev=0 --tags\`

這樣就會使用最新穩定版的 nvm。

同時必須讓終端機環境知道 nvm 在哪，修改你的 `.bashrc`、`.profile` 或 `.bash_profile`，添加一行 `source ~/.nvm/nvm.sh`，關閉再開一次終端機，輸入 `nvm --version` 確認，一切無誤會告訴你目前使用的 nvm 版本。

遇到 nvm 升級時，需要進入 `~/.nvm` 隱藏目錄，先切回主分支 `git checkout master`，拉取程式更新 `git pull`，接著再執行一次第三步驟的指令。

安裝自己需要的 Node.js 版本，例如想要安裝 `0.10` 最新穩定版，就輸入 `nvm install 0.10`，可以在系統上同時安裝多個版本的 Node.js，升級與測試都很方便。

再設置一下預設使用的 Node.js 版本，輸入 `nvm alias default stable`。

上面的倉儲連結網址中，可以看到更多 NVM 使用指令。

### NPM

安裝 Node.js 時已經連帶安裝了 NPM 套件管理程式，但版本很舊，所以最好先升級一下 NPM，輸入 `npm install npm -g`，再以 `npm -v` 指令確認版本（應該是 2.x.x）。

### Pandoc 與 Kindlegen

透過 Homebrew 安裝依然是最簡單無痛的做法。

1. `brew install pandoc` 安裝 Pandoc。
2. `brew install kindlegen` 安裝 Kindlegen。

輸入 `pandoc -v` 與 `kindlegen -releasenotes` 分別確認目前版本，使用 Homebrew 安裝的好處就是路徑都替你設置好了，如果是自行下載 kindlegen 程式，就要自己確認擺放路徑。總之，如果打開終端機輸入上面確認版本指令無法正常顯示時，製書也不會成功的。

## 簡易安裝篇

使用 buildebooks 製書工具，絕對必要的是 NPM（Node.js） 以及 Pandoc，這兩個也有安裝程式可以用：

1. Node.js [下載位置](https://nodejs.org/download/)
2. Pandoc [下載位置](https://github.com/jgm/pandoc/releases)

下載後就是點擊兩下，跟著指示說明一路到底就是了。

Kindlegen 因為是單純的命令列工具，就沒有簡便的點擊安裝程式可用，雖然就是一個檔案，比較麻煩的是要讓系統隨時隨地都能使用，還得在意路徑的正確設置。倘若以 EPUB 為主，轉製 Kindle mobi 版本只是偶一為之，另一個方法就是下載 [Kindle Previewer](http://www.amazon.com/gp/feature.html/?docId=1000765261) 這個能在電腦上觀看 Kindle 電子書的軟體，它的功能選單中也有轉換 EPUB 的功能。

> Mac 10.8 之後的系統安裝 Kindle Previewer 時，會提示先下載安裝 X11，也只能跟著一路裝到底了。

當然還是得使用終端機輸入點東西，例如上面的 NPM 升級程序 `npm install npm -g`，或是安裝 buildebooks 製書工具 `npm install -g buildebooks`。

> 使用 Node 安裝程式的缺點，就是上面的 NPM 升級或安裝 buildebooks 時有可能會失敗，系統提示需要管理員權限，你必須準備好管理員密碼（單人使用的電腦，管理員通常就是自己，或電腦的第一位帳號用戶），改用 `sudo npm install npm -g` 以及 `sudo npm install -g buildebooks`，日後升級也得使用 `sudo npm update -g`。

Buildebooks 0.2.x 之後，書籍專案目錄下就沒有程式在內了，完完全全都是你的內容檔案，由於都是使用 Markdown 與 Front Matter（YAML）的純文字檔，擺在 Dropbox、MEGA 等同步目錄很方便。想獲得完全的版本管理，也可以安裝視覺化的 Git 工具來用：

- [SourceTree](https://www.sourcetreeapp.com)
- [GitHub for Mac](https://mac.github.com)

> 以上均為 Mac 系統適用的程序與工具，其他系統應該也都有相對應的，不熟悉就不胡亂推薦了。