export default interface InfigoAddress {
    FirstName: string;
    LastName: string;
    CompanyName?: string;
    AddressLine1: string;
    AddressLine2?: string;
    Town: string;
    ZipPostalCode: string;
    StateProvince?: string;
    Country: string;
    Telephone: string;
    FaxNumber?: string;
    Email: string;
}
