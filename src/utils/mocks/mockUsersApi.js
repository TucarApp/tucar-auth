

export const mockUserData = {
    allowedApplications: [
        {
            contactEmail: "francisco@gmail.com",
            contactName: "Francisco Hairs",
            contactPhone: "+56 123456265",
            description: "Example",
            domain: "example.com",
            logoUri: "https://example.com/logo",
            name: "Example",
            organizationId: "Example_2",
            privacyPolicy: "https://example.com/privacy",
            termsOfService: "https://example.com/terms",
            uuid: "Example_1",
            websiteUri: "https://example.com",
        },
        {
            contactEmail: "Marce",
            contactName: "Example",
            contactPhone: "+56 123456789",
            description: "Example",
            domain: "example.com",
            logoUri: "https://example.com/logo",
            name: "Example",
            organizationId: "Example_3",
            privacyPolicy: "https://example.com/privacy",
            termsOfService: "https://example.com/terms",
            uuid: "Example_2",
            websiteUri: "https://example.com",
        }
    ]
};


export const fetchUserData = async () => {
   
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUserData;
};
