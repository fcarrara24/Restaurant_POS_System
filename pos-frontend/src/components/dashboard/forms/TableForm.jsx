import { useMutation } from '@tanstack/react-query';
import { addTable } from '../../../https';
import { enqueueSnackbar } from 'notistack';

const TableForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    tableNo: '',
    seats: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const mutation = useMutation({
    mutationFn: (data) => addTable(data),
    onSuccess: (res) => {
      enqueueSnackbar(res.data.message, { variant: 'success' });
      onSuccess?.();
    },
    onError: (error) => {
      const { data } = error.response;
      enqueueSnackbar(data.message, { variant: 'error' });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div>
        <label className="block text-[#ababab] mb-2 text-sm font-medium">
          Table Number
        </label>
        <div className="flex item-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
          <input
            type="number"
            name="tableNo"
            value={formData.tableNo}
            onChange={handleInputChange}
            className="bg-transparent flex-1 text-white focus:outline-none"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-[#ababab] mb-2 text-sm font-medium">
          Number of Seats
        </label>
        <div className="flex item-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
          <input
            type="number"
            name="seats"
            value={formData.seats}
            onChange={handleInputChange}
            className="bg-transparent flex-1 text-white focus:outline-none"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full rounded-lg mt-6 py-3 text-lg bg-yellow-400 text-gray-900 font-bold disabled:opacity-70"
      >
        {mutation.isPending ? 'Adding...' : 'Add Table'}
      </button>
    </form>
  );
};

export default TableForm;
