import http from "../http-common";

const getUserCount = () => 
{
    return http.get(`user-count`);
}

const MeetingService = {
    getUserCount
}

export default MeetingService;