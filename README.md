Build Ebooks
============

> Mac 上需要預先準備好必要程式，參考 [預裝程序](https://github.com/wastemobile/buildebooks/blob/master/preinstall.md)。

你可以下載 [bookfactory](https://github.com/wastemobile/bookfactory)，裡面有簡單的範例資料。

建置中。

### 安裝

1. `npm install buildebooks'
2. 在目錄下建立一個 `index.js`，只需要下面兩行：

    var build = require('buildebooks');
    
    build();

3. 製書時輸入 `node index.js`。

### 基本設定（config.md）

使用 `config.md` 設定：擺放書籍專案的目錄（base）、擺放電子書的目錄（dest）、書籍索引檔的名稱（index）以及預設讀取書籍資料的檔案名稱（metafile）。可以沒有這個檔案，系統就會依照預設值尋找。

```
---
base: 'projects'
dest: 'books'
index: 'book.md'
metafile: 'metadata.md'
---
```

- 你所有的書籍專案都在 `projects` 目錄下，一個專案一個子目錄，名稱不能重複。
- 書籍專案內使用一個 `book.md` 作為製書指引（索引）檔。
- 書籍（詮釋）資料檔是必要的。

### 製書索引檔（book.md 或自訂名稱）

某些製書程序要求使用固定的檔名與順序（例如 01-xxx, 02-xxx...），不太人性且增加了麻煩。Leanpub 與 GitBook 使用的模式好一些：透過一個索引檔案，告訴系統要使用哪些內容檔案製作電子書。

使用製書索引檔還有其他好處：

1. 書籍專案目錄下，可以自由擺放各種檔案，草稿、參考文件、編輯註記等等，無需受限任何規則。
2. 只有那些寫進索引檔的內容文件，才會影響電子書的製作。
3. 索引檔還可以處理一本書製作時的獨立配置，像是一些開關，要不要暫時關閉製書程序、要不要同步生成 Kindle 電子書、設定編輯版本等等。


最低限度的製書索引檔：

```
files:
  - foreword.md
  - introduction.md
  - ch1.md
  - ch2.md
  - notes/box01.md
  - ch3.md
  - postcontent/epilogue.md
```

製書索引檔至少需要指定內容檔案（files），依序構成書籍的內容（目錄）。

還可以配置下面這些開關：

- `filename` 未設定時，書籍專案目錄名稱就是書檔名稱。
- `metafile` 書籍詮釋資料檔是必要的，預設會尋找 `metadata.md`，你可以自由指定。
- `build` 設置為 `true` 或 `false`，未設定的預設值為 `true`，也就是在執行程序時會自動製作電子書，當你還在書寫或編輯流程，或是已經發行一個正式版本，暫時不需要每次都製作、覆蓋電子書檔時，可以選擇將其關閉。
- `kindle` 設置為 `true/false`，預設為 `false`。開啟這個開關會在製書時同步產生 Kindle 版本（使用 Kindlegen 轉製）。
- `edit_version` 編輯版本設定。
- `publish` 設置為 `true/false`，是否產生正式發行書檔。（not yet）
- `publish_version` 設置發行版本號。（not yet）

### 編輯版本設置

當你持續書寫與編輯，並執行製書程序時，`filename.epub` 或 `projectname.epub` 會被擺在專案目錄下的 `books` 目錄，每次製書都會覆蓋掉舊檔。在測試與發想階段你可以這樣用，但隨著內容愈來愈多，或是已經有對外提供過書檔，你會希望能更清楚的管理流程，這時就需要設置「編輯版本號」。

試著將編輯版本號設置為 `"0.1"`，這時製成的書檔會變成 `filename-0.1.epub`。當版本號未異動，任何修改與重複製書都會覆蓋掉舊檔。一旦你將版本號升級成 "0.2" 時，一個新的 `filename-0.2.epub` 被製作出來，"0.1" 版的書檔依舊保留著。

使用概念很簡單，當書寫與編輯告一段落，特別是有將書檔交給其他人檢視，或是已經發行出去時，你應該保留這一版的書檔供參考比對，此時就只需要將「編輯版本號」往前推進一版即可。



