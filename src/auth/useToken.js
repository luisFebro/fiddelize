import useContext from "context";

export default function useToken() {
    const { currUser = {} } = useContext();
    return currUser.token;
}
