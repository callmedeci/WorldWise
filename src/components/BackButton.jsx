import { useNavigate } from 'react-router-dom';
import Button from './Button';

function BackButton() {
  const navigate = useNavigate();

  return (
    <Button
      type='back'
      onClick={(e) => {
        e.preventDefault();
        // window.history.go(-1);
        navigate(-1);
      }}
    >
      &larr; Back
    </Button>
  );
}

export default BackButton;
