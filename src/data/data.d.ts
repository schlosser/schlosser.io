// Specify the file extension you want to import
declare module "src/data/museums.yaml" {
  const value: {
    id: string;
    img: string;
    title: string;
    location: string;
    website: string;
    trip: string;
    description: string;
  }[]; // Add type definitions here if desired
  export default value;
}
