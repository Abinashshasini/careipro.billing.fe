import { FaBoxOpen } from 'react-icons/fa';

export const NoData: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center text-gray">
    <FaBoxOpen size={50} className="mb-3 text-grayLight" />
    <p className="text-lg font-medium">{message}</p>
  </div>
);
