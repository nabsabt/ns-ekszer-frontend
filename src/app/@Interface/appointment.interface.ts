export interface Appointment {
  _id?: string;
  client: {
    name: string;
    email: string;
  };
  date: Date | string;
}
