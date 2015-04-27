Build Ebooks
============

> Mac 上需要預先準備好必要程式，參考 [預裝程序](https://github.com/wastemobile/buildebooks/blob/master/preinstall.md)。

建置中。

### config.md

```
---
base: 'projects'
dest: 'books'
index: 'book.md'
metadata: 'metadata.md'
style: 'default'
---
```

也可以不寫上面這個 `config.md`，就是使用預設值：

- 你所有的書籍專案都在 `projects` 目錄下，一個專案一個子目錄，不能重複。
- 書籍專案內使用一個 `book.md` 作為製書指引（索引）檔。

### index.js

1. `npm install buildebooks'
2. touch index.js, and write in:

    var build = require('buildebooks');
    
    build();

3. `node index.js`