import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";
import classNames from "classnames";

const bodyClassNames = classNames(
  "bg-white",
  "text-slate-900",
  "leading-normal",
  "tracking-normal",
  "w-4/5",
  "md:max-w-3xl",
  "mx-auto",
);

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head />
        <body className={bodyClassNames}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
