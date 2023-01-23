

export function GET(event) {
  console.log("in photos api");
  // log all headers
  console.log(...event.request.headers);
 
  return {};
}