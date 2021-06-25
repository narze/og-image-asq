import { readFileSync } from "fs"
import marked from "marked"
import { sanitizeHtml } from "./sanitizer"
import { ParsedRequest } from "./types"
const twemoji = require("twemoji")
const twOptions = { folder: "svg", ext: ".svg" }
const emojify = (text: string) => twemoji.parse(text, twOptions)

const rglr = readFileSync(
  `${__dirname}/../_fonts/Inter-Regular.woff2`
).toString("base64")
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString(
  "base64"
)
const noto = readFileSync(
  `${__dirname}/../_fonts/NotoSansThai-Regular.ttf`
).toString("base64")
const bold = readFileSync(
  `${__dirname}/../_fonts/NotoSansThai-Bold.ttf`
).toString("base64")

function getCss(theme: string, fontSize: string) {
  let foreground = "black"

  if (theme === "dark") {
    foreground = "white"
  }
  return `
    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
    }

    @font-face {
        font-family: 'NotoSansThai';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/ttf;charset=utf-8;base64,${noto})  format("truetype");
    }

    @font-face {
        font-family: 'NotoSansThai';
        font-style: normal;
        font-weight: bold;
        src: url(data:font/ttf;charset=utf-8;base64,${bold})  format("truetype");
    }

    body {
      margin: 0;
      text-align: center;
      height: 100vh;
    }

    .container {
      min-height: 100vh;
      margin: 0;
      height: 100vh;

      background-image: linear-gradient(
        to bottom,
        #002b7f,
        #002b7f 15%,
        #ffffff 15%,
        #ffffff 30%,
        #ce1126 30%,
        #ce1126 70%,
        #ffffff 70%,
        #ffffff 85%,
        #002b7f 85%,
        #002b7f 100%
      );
      background-size: 100% 100%;

      display: flex;
      text-align: center;
      align-items: center;
      justify-content: center;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .logo {
        margin: 0 75px;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    .spacer {
        /* margin: 150px; */
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }

    .heading {
        font-family: 'NotoSansThai', 'Inter', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        color: ${foreground};
        line-height: 120%;

        text-shadow: 2px 2px 4px white;
    }
    `
}

export function getHtml(parsedReq: ParsedRequest) {
  const { text, theme, md, fontSize } = parsedReq
  return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize)}
    </style>
    <body>
        <div class="container">
            <div class="heading">${emojify(
              md ? marked(text) : sanitizeHtml(text)
            )}
            </div>
        </div>
    </body>
</html>`
}
