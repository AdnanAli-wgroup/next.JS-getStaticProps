import { Fragment } from "react";
import path from "path";
import fs from "fs/promises";

function ProductDetailPage(props) {
  const { loadedProduct } = props;

  // if (!loadedProduct) {
  //   return <p>Loading....</p>;
  // }

  return (
    <Fragment>
      <h1>{loadedProduct.title}</h1>
      <p>{loadedProduct.description}</p>
    </Fragment>
  );
}

async function getData() {
  const filePath = path.join(process.cwd(), "data", "dummy-backend.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  return data;
}

export async function getStaticProps(context) {
  // context is ue for the static values
  const { params } = context;

  // params have key value pair
  const productId = params.pid;
  const data = await getData();

  const product = data.products.find((product) => product.id === productId);

  return {
    props: {
      loadedProduct: product,
    },
  };
}

// here we are using multiple getStaticProps so the next does not understand which page render the first so we use the getStatic oath for that purpose

export async function getStaticPaths() {
  const data = await getData();

  const ids = data.products.map((product) => product.id);
  const pathWithParams = ids.map((id) => ({ params: { pid: id } }));

  // here  pid is the name of the page adn the value pair indicate  how many time it renders
  return {
    paths: pathWithParams,
    fallback: false,

    // paths: [
    //   { params: { pid: "p1" } },
    //   // { params: { pid: "p2" } },
    //   // { params: { pid: "p3" } },
    // ],

    // this indicate that the pages are not over there should also b added(when the case is true)==> it still load the page 2 and 3
    // but here use the params to redirect that page makes an error, because it take some time to load that page so thats why we use a check at above of loading
    // fallback: true,

    // if it is false you'll write all the paths
    // fallback: false,

    // in case of fallback:blocking we don't need a check over there, bcz next will wait for the response
    // fallback: "blocking",
  };
}

export default ProductDetailPage;
