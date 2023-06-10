export const URLS = {
    keycloak_logout: "http://localhost:3500/logout/",
    keycloak_login: "http://localhost:3500/login/",
    keycloak_register: "http://localhost:3500/register/",
    examDefination: "http://localhost:4000/exam/defination/",
    questions: "http://localhost:4001/api/questions/",
    users: "http://localhost:3500/users/",
    examInstance:"http://localhost:4000/exam/instance/",
    takeExam:"http://localhost:3000/exams/"
}


export const ReqMethods ={
    get:"GET",
    post:"POST",
    patch:"PATCH",
    delete:"DELETE",
}

export const Messages = {
    noDataFound: "no data found for you now"
}
export const ErrorsMessages = {
    messingFields: "all fields are required",
    examServiceNotWorking: "it's look like exam service doesn't work for now",
    questionServiceNotWorking: "it's look like questions service doesn't work for now",
    keyCloakNotWorking: "it's look like keycloak service doesn't work for now"
}