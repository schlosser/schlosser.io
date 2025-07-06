// Specify the file extension you want to import
declare module "@data/museums.yml" {
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
