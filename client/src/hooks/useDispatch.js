import { useStoreDispatch } from 'easy-peasy';
import { showSnackbar } from '../redux/actions/snackbarActions';

export default function useDispatch() {
    return useStoreDispatch();
}

export { showSnackbar };
