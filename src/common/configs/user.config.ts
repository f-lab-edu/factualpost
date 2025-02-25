const config = {
    user: {
        userId : {
            min : 2,
            max : 20
        },
        password : {
            min : 8,
            max : 20
        },
        specialCharCount: 1,
        passwordRound: 10,
        specialType : '[!@#$%^&*(),.?":{}|<>]'
    }
};

export default () => config;