預裝程序
=======

在 Mac 上必須預先安裝好 Node.js（含 NPM 套件管理）、Homebrew、Git 以及 Command Line Tools for Xcode，以及製書需要使用的 Pandoc 與 Kindlegen。

### Command Line Tools for Xcode

即使沒有安裝完整 Xcode，仍然可以在終端機輸入 `xcode-select --install` 進行安裝。如果已經安裝了 Xcode，也要進入設定選項確認是否有勾選下載安裝 Command Line Tools。

安裝之後，升級都會出現在 Mac App Store。

### Homebrew

Mac 上最好用的套件安裝與管理工具，參考[官網](http://brew.sh/index_zh-tw.html)說明，拷貝安裝指令到終端機，依照指示完成安裝即可。

平日三不五時在終端機輸入 `brew update && brew upgrade` 即可自動更新。

### Git

在終端機輸入 `brew install git`。

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