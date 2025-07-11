import React from 'react';
import {
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Select,
  Option,
  Typography,
} from '@material-tailwind/react';

const JoinCampModal = ({ camp, onClose, onSubmit, isSubmitting }) => {
  const [form, setForm] = React.useState({
    participant_name: '',
    email: '',
    age: '',
    phone: '',
    gender: '',
    emergency_contact: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelect = (value) => {
    setForm({ ...form, gender: value });
  };

  const handleSubmit = () => {
    if (!form.participant_name || !form.email) {
      return alert('Name and email are required');
    }
    const data = {
      ...form,
      camp_id: camp._id,
      camp_name: camp.title,
      camp_fees: camp.fees,
      venue: camp.venue,
      doctor: camp.healthcare_professional,
    };
    onSubmit(data);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose} // clicking outside closes modal
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()} // prevent modal close on inner click
      >
        <DialogHeader className="flex justify-between items-center px-6 pt-6">
          <Typography variant="h5" color="blue-gray" className="font-semibold">
            Join Camp - {camp.title}
          </Typography>
          <Button
            variant="text"
            color="gray"
            onClick={onClose}
            className="text-xl font-bold leading-none p-0"
          >
            &times;
          </Button>
        </DialogHeader>

        <DialogBody className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-4">
          {/* Read-only inputs */}
          <Input label="Camp Name" value={camp.title} readOnly className="bg-gray-100" />
          <Input label="Fees" value={`$${camp.fees}`} readOnly className="bg-gray-100" />
          <Input label="Location" value={camp.venue} readOnly className="bg-gray-100" />
          <Input label="Doctor" value={camp.healthcare_professional} readOnly className="bg-gray-100" />

          {/* User inputs */}
          <Input
            label="Your Name"
            name="participant_name"
            value={form.participant_name}
            onChange={handleChange}
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Age"
            name="age"
            type="number"
            value={form.age}
            onChange={handleChange}
            min={1}
            max={120}
          />
          <Input label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} />
          <Select label="Gender" value={form.gender} onChange={handleSelect} required>
            <Option value="Male">Male</Option>
            <Option value="Female">Female</Option>
            <Option value="Other">Other</Option>
          </Select>
          <Input
            label="Emergency Contact"
            name="emergency_contact"
            value={form.emergency_contact}
            onChange={handleChange}
          />
        </DialogBody>

        <DialogFooter className="flex justify-between px-6 pb-6">
          <Button variant="outlined" color="gray" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            color="blue"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Joining...
              </>
            ) : (
              'Join Now'
            )}
          </Button>
        </DialogFooter>
      </div>
    </div>
  );
};

export default JoinCampModal;
