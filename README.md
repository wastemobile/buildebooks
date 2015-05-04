Build Ebooks
============

> Mac 上需要預先準備好必要程式，參考 [預裝程序](https://github.com/wastemobile/buildebooks/blob/master/preinstall.md)。打開終端機在任何目錄輸入下列三條指令，都必須運作正常、顯示目前版本，否則製書程式無法執行成功。

```
  $ npm -v //檢視 NPM 版本（2.8.4）。
  $ pandoc -v //檢視 Pandoc 版本（1.13.2）。
  $ kindlegen -releasenotes //檢視 Kindlegen 版本（V2.9）。
```

持續不穩定建置中。

## 0.2.x

### 安裝

1. `npm install -g buildebooks` 安裝於全域環境以便執行終端機指令模式。（如果遵照 [預裝程序](https://github.com/wastemobile/buildebooks/blob/master/preinstall.md) 的安裝方式，就不需要 `sudo`；萬一 Node.js 的安裝方式不同，可以嘗試使用 `sudo npm install -g buildebooks` 安裝。）
2. 打開終端機，不管在單書目錄、多書目錄，或使用總專案管理目錄，都只需要輸入 `buildebooks` 命令就能自動判斷、製作電子書。
3. 未安裝在全域執行環境就無法使用終端機指令，你需要自行建立 Node 指令檔，例如：

    var build = require('buildebooks').bes;

    build();

4. 製書時輸入 `node index.js` 即可運作。

> 安裝於全域（with `-g`）之後，任意目錄執行 `buildebook` 或 `buildebooks` 均可。輸入 `buildebook(s) -v` 或 `--version` 會顯示目前版本。由於仍處於不穩定開發階段，常常運行 `npm update -g` 獲得最近的更新版本。

### 運作於單書目錄

```
(1) Single Book Folder
/yourfolder
  /book.md //製書索引，沒有這個檔案就不會製作電子書
  /metadata.md //詮釋資料
  /intro.md
  /ch1.md
  /ch2.md
  /ch3.md
  /Cover.png
  /epub.css
  /style/default.css
  /image/cover.jpg
  /part2/another.md
```  

> 你可以自由使用次目錄擺放內容、素材，只要在製書索引中添加正確的路徑，例如 `images/cover.jpg`, `style/stylesheet.css` 或 `part1/mycontent.md`, `part2/another.md` 均可。

```
---
# 唯一必要的設定
files:
  - intro.md
  - ch1.md
  - ch2.md
  - ch3.md
# 自訂電子書檔名稱，未設定會使用上層目錄名稱（此例就是 `yourfolder`）
# filename: "mybook"
# 關閉製作。未設定時的預設值是 true
# build: false
# 同步製作 Kindle 電子書，預設值是 false
# kindle: true
# 編輯版本號
# edit_version: "0.2"
# 是否複製成正式發行版本，預設是 false
# public: false
# 發行版本號
# release_verson: "1.0"
# 試讀版本（public 設為 true 時才會製作）
sample:
  - intro.md
  - ch1.md
---
```

### 基本設定（config.md）

> 0.2.x 之後，非單書目錄才會用到 `config.md`。

使用 `config.md` 設定：擺放書籍專案的目錄（base）、擺放電子書的目錄（dest）、書籍索引檔的名稱（index）以及預設讀取書籍資料的檔案名稱（metafile）。可以沒有這個檔案，系統就會依照預設值尋找。

```
---
# 擺放所有書籍專案的目錄（使用集中目錄的情境）
base: 'projects'
# 預設擺放製成書檔的目錄
dest: 'books'
# 製書索引檔的名稱
index: 'book.md'
# 預設尋找的詮釋資料檔名稱
metafile: 'metadata.md'
# 共用樣式檔目錄
stylesFolder: 'styles'
---
```

- 你所有的書籍專案都在 `projects` 目錄下，一個專案一個子目錄，名稱不能重複。
- 書籍專案內使用一個 `book.md` 作為製書指引（索引）檔。
- 書籍（詮釋）資料檔是必要的。

除了上面提到的「單書目錄」之外，以下兩種目錄也都可以自由使用：

```
(2) Multi-Books folder
/somefolder
  /book1
  /book2
  /book3
  /styles （可以使用共用樣式目錄）
  config.md （可以使用設定檔，`base` 設定在此狀況下無效）
```

使用終端機在該目錄下執行 `[ ~/somefolder] $ buildebooks` 即可。

```
(3) Center Projects folder
/minifactory
  /projects
    /book1
    /book2
    /book3
  /styles （共用樣式目錄）
  config.md （可以使用設定檔）
```

使用終端機在該目錄下執行 `[ ~/minifactory] $ buildebooks` 即可。

> 安裝在全域的好處就是：你的書籍專案目錄不再有什麼 `index.js` 或是 `node_modules` 目錄之類的玩意，完全只有與內容相關的檔案，清爽許多。

### 製書索引檔（book.md 或自訂名稱）

某些製書程序要求使用固定的檔名與順序（例如 01-xxx, 02-xxx...），不太人性且增加了麻煩。Leanpub 與 GitBook 使用的模式好一些：透過一個索引檔案，告訴系統要使用哪些內容檔案製作電子書。

使用製書索引檔還有其他好處：

1. 書籍專案目錄下，可以自由擺放各種檔案，草稿、參考文件、編輯註記等等，無需受限任何規則。
2. 只有那些寫進索引檔的內容文件，才會影響電子書的製作。
3. 索引檔還可以處理一本書製作時的獨立配置，像是一些開關，要不要暫時關閉製書程序、要不要同步生成 Kindle 電子書、設定編輯版本等等。

製書索引檔至少需要指定內容檔案（files），依序構成書籍的內容（目錄）。

還可以配置下面這些開關：

- `filename` 未設定時，書籍專案目錄名稱就是書檔名稱。
- `metafile` 書籍詮釋資料檔是必要的，預設會尋找 `metadata.md`，你可以自由指定。
- `build` 設置為 `true` 或 `false`，未設定的預設值為 `true`，也就是在執行程序時會自動製作電子書，當你還在書寫或編輯流程，或是已經發行一個正式版本，暫時不需要每次都製作、覆蓋電子書檔時，可以選擇將其關閉。
- `kindle` 設置為 `true/false`，預設為 `false`。開啟這個開關會在製書時同步產生 Kindle 版本（使用 Kindlegen 轉製）。
- `edit_version` 編輯版本設定。
- `stylesheet` 使用的樣式檔，在此處設置的優先權比詮釋資料檔更高，在編輯、修正測試與改版的情境下比較方便。指定樣式檔時，專案目錄找不到，會去比對共用樣式目錄。
- `cover-image` 指定封面圖檔，在此處設置的優先權比詮釋資料檔更高，便利編輯與改版過程的使用。
- `publish` 設置為 `true/false`，是否產生正式發行書檔。（not yet）
- `publish_version` 設置發行版本號。（not yet）

### 編輯版本設置

當你持續書寫與編輯，並執行製書程序時，`filename.epub` 或 `projectname.epub` 會被擺在專案目錄下的 `books` 目錄，每次製書都會覆蓋掉舊檔。在測試與發想階段你可以這樣用，但隨著內容愈來愈多，或是已經有對外提供過書檔，你會希望能更清楚的管理流程，這時就需要設置「編輯版本號」。

試著將編輯版本號設置為 `"0.1"`，這時製成的書檔會變成 `filename-0.1.epub`。當版本號未異動，任何修改與重複製書都會覆蓋掉舊檔。一旦你將版本號升級成 "0.2" 時，一個新的 `filename-0.2.epub` 被製作出來，"0.1" 版的書檔依舊保留著。

使用概念很簡單，當書寫與編輯告一段落，特別是有將書檔交給其他人檢視，或是已經發行出去時，你應該保留這一版的書檔供參考比對，此時就只需要將「編輯版本號」往前推進一版即可。

### 樣式檔使用 0.1.7

使用樣式檔（stylesheet）時，最簡單的方法就是擺放在書籍專案目錄，指定目錄下的 `epub.css` 或次目錄中的 `stylesheet/epub.css`。因為詮釋資料是跟著書走的，理論上應該在其中設定要使用的樣式檔，這也是 Pandoc 的預設處理模式。

但你可以在製書索引檔中指定樣式檔，同樣是以一個專案的目錄為基準去優先比對檔案，找到了就使用，測試調整時比較方便。

因為這個系統一開始就以能「同時處理多本書」為出發點，共用樣式檔的可能性很高，所以在基本設定中加了一個 `stylesFolder` （共用樣式目錄）的選項，預設是 `styles`，可以擺放多個常用、通用的樣式。

如此一來，假設你預先製作好了 `default.css`、`fiction.css` 與 `tech.css` 幾種樣式，就可以在詮釋資料或製書索引中直接指定。若是書籍專案目錄下有同名的樣式檔，會優先被使用。

比對優先順序為：

1. 索引檔中指定了樣式，先找專案目錄，其次是共用樣式目錄，先找到先用。
2. 索引檔中未指定或找不到，詮釋資料有指定，一樣先找專案目錄，其次是共用樣式目錄，先找到先用。
3. 索引檔或詮釋資料檔中均未指定，或在專案目錄與共用樣式目錄都找不到，套用的就是 Pandoc 預設、最精簡的樣式。


### 唯一識別碼 0.1.9

Pandoc 可以接受這些唯一識別碼：ISBN-10, GTIN-13, UPC, ISMN-10, DOI, LCCN, GTIN-14, ISBN-13, Legal deposit number, URN, OCLC, ISMN-13, ISBN-A, JP, OLCC，這些也是 EPUB 允許的代碼。

在詮釋資料中以這樣的形式輸入：

```
identifier:
- scheme: ISBN-13
  text: 978-986-276-419-0
```

如果沒有設定任何一個，Pandoc 預設會自動產生一個隨機生成的 UUID，每一次製作時都不一樣。對於自主出版或新型態的數位出版來說，沒有必要去申請傳統的 ISBN，所以要想辦法讓每一個書籍專案擁有一個不變的唯一識別 UUID，不管轉製多少次，這個識別碼都該維持不變。

所以當第一次轉製電子書時，在書籍專案目錄下會建立一個 `uuid.xml` 的檔案，另外在根目錄的 `books.json` 中也有一份。這兩個檔案都由程式管控，不應該碰觸。萬一 `uuid.xml` 被殺掉了，下次製書時會自動產生，UUID 依舊維持不變。但若是殺掉了 `books.json`，就請也一併手動移除 `uuid.xml`，否則 UUID 就會不一致了。

> 目前這個維持「唯一識別 UUID」的機制還不是很牢靠，在專案目錄名稱不變的狀況下，一般不會出錯。未來或許該添加一些清理、檢測或搬移的功能。

### 試讀版本 0.1.12

在製書索引中增加了一個 `sample` 的設定，方法與 `files` 相同。這是準備與發行功能搭配的選項，因此 `publish` 也必須設置為 `true`。

簡單的說，就是製作一個「試讀版本」，可以自由指定要擺放的內容章節。檔名後以 `-sample` 區隔，命名原則與正式版（含版本號）一致，同時適用於 EPUB 與 Kindle 版本的製作（因此若指定 `publish: true` 且設置了 `sample` 要使用的內容，一次就會產生四個書檔。