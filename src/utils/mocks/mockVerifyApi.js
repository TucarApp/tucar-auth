

export const mockVerifyResponse = {
    _id: "Example_1",
    code: "+56",
    country: "Chile",
    email: "example@gmail.com",
    firstname: "John",
    lastname: "Doe",
    phone: "123456789",
    verifiedElements: {
        email: true,
        phone: false
    }
};


export const verifyUser = async () => {
    return mockVerifyResponse;
};
