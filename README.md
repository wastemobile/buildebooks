Build Ebooks
============

> Mac 上需要預先準備好必要程式，參考 [預裝程序](https://github.com/wastemobile/buildebooks/blob/master/preinstall.md)。

試玩一下測試與範例倉儲 [bookfactory](https://github.com/wastemobile/bookfactory) 比較好理解。

建置中。

### 安裝

1. `npm install buildebooks'
2. 在目錄下建立一個 `index.js`，只需要下面兩行：

    var build = require('buildebooks');
    
    build();

3. 製書時輸入 `node index.js`。

### 說明

這是一個簡化使用 Pandoc 與 Kindlegen 製作電子書的小工具。

### config.md

```
---
base: 'projects'
dest: 'books'
index: 'book.md'
metafile: 'metadata.md'
style: 'default'
---
```

也可以不寫上面這個 `config.md`，就是使用預設值：

- 你所有的書籍專案都在 `projects` 目錄下，一個專案一個子目錄，不能重複。
- 書籍專案內使用一個 `book.md` 作為製書指引（索引）檔。

