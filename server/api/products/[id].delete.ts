export default defineEventHandler(async (e) => {
  const id = Number(getRouterParam(e, "id"));
  // console.log("hit products get");

  return await db.delete(products).where(eq(products.id, id));

  // return [
  //   {
  //     id: "ms",
  //     title: "Mie  Setan",
  //     description: "lorem ipsun dolor sit amet",
  //     image: "1.jpg",
  //   },
  //   {
  //     id: "mi",
  //     title: "Mie Iblis",
  //     description: "lorem ipsun dolor sit amet",
  //     image: "2.jpg",
  //   },
  //   {
  //     id: "mj",
  //     title: "Mie Jebew",
  //     description: "lorem ipsun dolor sit amet",
  //     image: "3.jpg",
  //   },
  // ];
});
