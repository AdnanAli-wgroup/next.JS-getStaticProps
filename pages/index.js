// path module help to find the path
import path from "path";

// here the fs indicate the file server the data load on the server not on browser
import fs from "fs/promises";

export default function HomePage(props) {
  // these props are get from the getStaticProps the products is the key down the static props
  const { products } = props;
  return (
    <div>
      <h1>hello world</h1>
      <ul>
        {products.map((product) => {
          return <li key={product.id}>{product.title}</li>;
        })}
      </ul>
    </div>
  );
}
// 1. execute the getStaticProps then
// 2. render the component

export async function getStaticProps() {
  // after every 10 sec it will regenerate the page
  console.log("(Re-)Generating...! ");

  // the read file need the path so, here cwd(current working directory)
  // goes to the data folder ===> get the file of dummy-backEnd data file
  const filePath = path.join(process.cwd(), "data", "dummy-backend.json");

  // readFileSync execute the fileSync(block the execution until it finished) && readFile work as the call back
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  // to redirect to another page
  if (!data) {
    return {
      redirect: {
        destination: "/no-data",
      },
    };
  }

  // if we fail to fetch data (the data in the dummy file)
  if (data.products.length === 0) {
    return {
      notFound: true,
    };
  }

  // prepare the props for our component #Pre_rendering
  // this code not visible for the clint side only render by it self
  return {
    props: {
      products: data.products,
    },
    // we add the revalidation which indicate that the expunction on the next change at least take 10sec
    revalidate: 10,
    // notFound: true,
    // redirect
  };
}
