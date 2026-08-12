"use client";

import { Box, Button, Card, CardContent, Checkbox, CircularProgress, FormControl, MenuItem, OutlinedInput, Select, Typography } from "@mui/material";
import { SubmitEvent, useRef, useState } from "react";
import GuestCardHeader from "./component/GuestCardHeader";
import ReCAPTCHA from "react-google-recaptcha";
import CustomRecaptcha from "../utils/CustomRecaptcha/CustomRecaptcha";

interface FormInputs {
    fname: string,
    mname: string,
    lname: string,
    email: string,
    age: string,
    sex: string,
    work: string,
    address: string,
    contact: string,
    paymentFile: File | null,
    captcha: ReCAPTCHA | null
}

export const RegistrationCategory = {
    REGULAR_RATE: {
        id: 1,
        name: 'Regular Rate',
        amount: '₱2,499.00 (VAT-EX)',
    },
    RESERVATION: {
        id: 2,
        name: 'Reservation',
        amount: '₱1,000.00 (VAT-EX)',
    },
    EARLY_BIRD_RATE: {
        id: 3,
        name: 'Early Bird Rate',
        amount: '₱6,000.00 (VAT-EX) until August 8, 2026.',
    }
};

export const PaymentOptions = {
    GCASH: {
        id: 1,
        name: 'GCash',
        amount: '09658444982',
        imgUrl: '/assets/gcash.jpg'
    },
    GOTYME: {
        id: 2,
        name: 'GoTyme',
        amount: '018864853860',
        imgUrl: '/assets/gotyme.jpg'
    },
    MAYA: {
        id: 3,
        name: 'Maya',
        amount: '09658444982',
        imgUrl: '/assets/maya.jpg'
    }
};

export default function Login() {
    const [selectedPaymentOption, setSelectedPaymentOption] = useState<any | null>(null);
    const [selectedRequestType, setSelectedRequestType] = useState<any | null>(null);
    const [formData, setFormData] = useState<FormInputs>({
        fname: "",
        mname: "",
        lname: "",
        email: "",
        sex: "",
        age: "",
        work: "",
        address: "",
        contact: "",
        paymentFile: null,
        captcha: null
    });

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const isButtonDisabled =
        Object.entries(formData).filter(([key]) => key !== 'mname').some(([_, value]) => value === '') ||
        !formData.captcha ||
        !formData.paymentFile ||
        !selectedPaymentOption ||
        !selectedRequestType ||
        isSubmitting;

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();
        if (!formData?.paymentFile) return alert('Please upload a proof of payment.');
        setIsSubmitting(true);

        const data = new FormData();
        data.append('fname', formData.fname);
        data.append('mname', formData.mname);
        data.append('lname', formData.lname);
        data.append('email', formData.email);
        data.append('sex', formData.sex);
        data.append('age', formData.age);
        data.append('work', formData.work);
        data.append('address', formData.address);
        data.append('contact', formData.contact);
        data.append('captcha', String(formData.captcha));
        data.append('category', `${selectedRequestType?.name} - ${selectedRequestType?.amount}`);
        data.append('payment_option', selectedPaymentOption?.name);
        data.append('paymentFile', formData?.paymentFile);

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                body: data,
            });

            const result = await res.json();

            if (!res.ok) {
                alert(result?.error);
            } else {
                alert('Registration complete and file uploaded!');
                window.location.reload();
            }
        } catch (err) {
            alert(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <GuestCardHeader>
                <CardContent sx={{ p: 5 }} component="form" onSubmit={handleSubmit}>
                    <Box>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                            FREQIT Solutions and Resonate Institute Inc. are committed to protecting your personal data in accordance with Republic Act No. 10173, otherwise known as the Data Privacy Act of 2012.
                        </Typography>
                    </Box>

                    <Box sx={{ mt: 1, mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                            The personal information collected through this form will be solely used for the purposes of SGAPP.
                        </Typography>
                    </Box>

                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Email <span style={{ color: 'red' }}>*</span></Typography>

                    <FormControl fullWidth size="small" margin="dense">
                        <OutlinedInput
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({
                                ...formData,
                                email: e.target.value
                            })}
                        />
                    </FormControl>

                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', mt: 1 }}>First name <span style={{ color: 'red' }}>*</span></Typography>

                    <FormControl fullWidth size="small" margin="dense">
                        <OutlinedInput
                            id="fname"
                            type="text"
                            value={formData.fname}
                            onChange={(e) => setFormData({
                                ...formData,
                                fname: e.target.value
                            })}
                        />
                    </FormControl>

                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', mt: 1 }}>Middle name</Typography>

                    <FormControl fullWidth size="small" margin="dense">
                        <OutlinedInput
                            id="mname"
                            type="text"
                            value={formData.mname}
                            onChange={(e) => setFormData({
                                ...formData,
                                mname: e.target.value
                            })}
                        />
                    </FormControl>

                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', mt: 1 }}>Last name <span style={{ color: 'red' }}>*</span></Typography>

                    <FormControl fullWidth size="small" margin="dense">
                        <OutlinedInput
                            id="emlnameail"
                            type="text"
                            value={formData.lname}
                            onChange={(e) => setFormData({
                                ...formData,
                                lname: e.target.value
                            })}
                        />
                    </FormControl>

                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', mt: 1 }}>Contact number <span style={{ color: 'red' }}>*</span></Typography>

                    <FormControl fullWidth size="small" margin="dense">
                        <OutlinedInput
                            id="contact"
                            type="number"
                            value={formData.contact}
                            onChange={(e) => setFormData({
                                ...formData,
                                contact: e.target.value
                            })}
                        />
                    </FormControl>

                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', mt: 1 }}>Address <span style={{ color: 'red' }}>*</span></Typography>

                    <FormControl fullWidth size="small" margin="dense">
                        <OutlinedInput
                            id="address"
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({
                                ...formData,
                                address: e.target.value
                            })}
                        />
                    </FormControl>

                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', mt: 1 }}>Age <span style={{ color: 'red' }}>*</span></Typography>

                    <FormControl fullWidth size="small" margin="dense">
                        <OutlinedInput
                            id="age"
                            type="number"
                            value={formData.age}
                            onChange={(e) => setFormData({
                                ...formData,
                                age: e.target.value
                            })}
                        />
                    </FormControl>

                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', mt: 1 }}>Sex <span style={{ color: 'red' }}>*</span></Typography>

                    <FormControl fullWidth size="small" margin="dense">
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formData.sex}
                            onChange={(e) => setFormData({
                                ...formData,
                                sex: e.target.value
                            })}
                        >
                            <MenuItem value="MALE">MALE</MenuItem>
                            <MenuItem value="FEMALE">FEMALE</MenuItem>
                        </Select>
                    </FormControl>

                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', mt: 1 }}>Work/Institutional Affiliation <span style={{ color: 'red' }}>*</span></Typography>

                    <FormControl fullWidth size="small" margin="dense">
                        <OutlinedInput
                            id="work"
                            type="text"
                            value={formData.work}
                            onChange={(e) => setFormData({
                                ...formData,
                                work: e.target.value
                            })}
                        />
                    </FormControl>

                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', my: 2 }}>
                        <img src={'/assets/738774557_10164735419234244_596011779044760202_n2.jpg'} style={{
                            height: '100%',
                            width: '100%'
                        }} />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mt: 2 }}>Registration Category <span style={{ color: 'red' }}>*</span></Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Inclusive of training meals, shirts and other freebies.</Typography>
                    </Box>

                    {
                        Object.values(RegistrationCategory).map((requestType, index) => {
                            return <Card onClick={() => { setSelectedRequestType(requestType); }} key={index} elevation={0} sx={{
                                cursor: 'pointer',
                                border: requestType?.id === selectedRequestType?.id ? '1px dashed' : '1px solid',
                                borderColor: requestType?.id === selectedRequestType?.id ? 'rgba(37, 35, 35, 0.23)' : 'rgba(12, 10, 10, 0.02)',
                                backgroundColor: requestType?.id === selectedRequestType?.id ? 'rgba(31, 66, 133, 0.05)' : 'transparent',
                                '&:hover': {
                                    borderColor: requestType?.id !== selectedRequestType?.id ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 87, 34, 0.05)',
                                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)'
                                }
                            }}>
                                <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 0 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: '500', maxWidth: '80%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {requestType.name}
                                        </Typography>

                                        {
                                            requestType?.id === selectedRequestType?.id &&
                                            <Checkbox
                                                size="small"
                                                sx={{
                                                    position: 'relative',
                                                    p: 0,
                                                    m: 0,
                                                    color: 'rgb(31, 66, 133)',
                                                    '&.Mui-checked': {
                                                        color: 'rgb(31, 66, 133)'
                                                    }
                                                }}
                                                checked={requestType?.id === selectedRequestType?.id}
                                                readOnly
                                                onChange={() => setSelectedRequestType(requestType)}
                                            />
                                        }
                                    </Box>

                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        {requestType.amount}
                                    </Typography>
                                </CardContent>
                            </Card>
                        })
                    }

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mt: 2 }}>Choose payment option <span style={{ color: 'red' }}>*</span></Typography>
                        <Box sx={{ lineHeight: '1' }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>For proof of payment, don't forget to upload 1 PDF or image (max 100MB) showing a clear transaction number, date, and timestamp.</Typography>
                        </Box>
                    </Box>

                    {
                        Object.values(PaymentOptions).map((requestType, index) => {
                            const isSelected = requestType?.id === selectedPaymentOption?.id;
                            return <Card onClick={() => { setSelectedPaymentOption(requestType); }} key={index} elevation={0} sx={{
                                cursor: 'pointer',
                                border: isSelected ? '1px dashed' : '1px solid',
                                borderColor: isSelected ? 'rgba(37, 35, 35, 0.23)' : 'rgba(12, 10, 10, 0.02)',
                                backgroundColor: isSelected ? 'rgba(31, 66, 133, 0.05)' : 'transparent',
                                '&:hover': {
                                    borderColor: isSelected ? 'rgba(255, 87, 34, 0.05)' : 'rgba(0, 0, 0, 0.1)',
                                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)'
                                }
                            }}>
                                <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 0 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: '500', maxWidth: '80%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {requestType.name}
                                        </Typography>

                                        {
                                            isSelected &&
                                            <Checkbox
                                                size="small"
                                                sx={{
                                                    position: 'relative',
                                                    p: 0,
                                                    m: 0,
                                                    color: 'rgb(31, 66, 133)',
                                                    '&.Mui-checked': {
                                                        color: 'rgb(31, 66, 133)'
                                                    }
                                                }}
                                                checked={isSelected}
                                                readOnly
                                                onChange={() => setSelectedPaymentOption(requestType)}
                                            />
                                        }
                                    </Box>

                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        {requestType.amount}
                                    </Typography>

                                    {
                                        isSelected &&
                                        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', my: 2, px: 0 }}>
                                            <img src={requestType.imgUrl} style={{
                                                height: '100%',
                                                width: '100%',
                                                borderRadius: 4
                                            }} />
                                        </Box>
                                    }
                                </CardContent>
                            </Card>
                        })
                    }


                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', mt: 2 }}>Proof of payment <span style={{ color: 'red' }}>*</span></Typography>

                    <FormControl fullWidth size="small" margin="dense">
                        <OutlinedInput
                            id="email"
                            type="file"
                            inputProps={{ accept: '.pdf,.jpg,.jpeg,.png,image/jpeg,image/png' }}
                            onChange={(e) => {
                                const target = e.target as HTMLInputElement;

                                if (target.files && target.files[0]) {
                                    setFormData({ ...formData, paymentFile: target.files[0] });
                                }
                            }}
                        />
                    </FormControl>

                    <Box sx={{ mt: 2 }}>
                        <CustomRecaptcha callbackFunction={(e) => setFormData({
                            ...formData,
                            captcha: e
                        })} />
                    </Box>

                    <Button type="submit" color="primary" disabled={isButtonDisabled} variant="contained" sx={{ mt: 3, cursor: isButtonDisabled ? 'not-allowed' : 'default' }} fullWidth>
                        {
                            isSubmitting
                                ? <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CircularProgress color="inherit" size={15} sx={{ mr: 1 }} /> Please wait..
                                </Box> : <>SUBMIT</>
                        }
                    </Button>
                </CardContent>
            </GuestCardHeader>
        </>
    );
}
