"use client";

import { Box, Button, Card, CardContent, Checkbox, CircularProgress, FormControl, OutlinedInput, Typography } from "@mui/material";
import { SubmitEvent, useRef, useState } from "react";
import GuestCardHeader from "./component/GuestCardHeader";
import ReCAPTCHA from "react-google-recaptcha";
import CustomRecaptcha from "../utils/CustomRecaptcha/CustomRecaptcha";

interface FormInputs {
    fname: string,
    mname: string,
    lname: string,
    email: string,
    job_title: string,
    agency: string,
    contact: string,
    paymentFile: File | null,
    captcha: ReCAPTCHA | null
}

export const RegistrationCategory = {
    REGULAR_RATE: {
        id: 1,
        name: 'Regular Rate',
        amount: '₱25,000.00 (VAT-EX)',
    },
    RESERVATION: {
        id: 2,
        name: 'Reservation',
        amount: '₱5,000.00 (VAT-EX)',
    },
    EARLY_BIRD_RATE: {
        id: 3,
        name: 'Early Bird Rate',
        amount: '₱24,000.00 (VAT-EX) If paid on or before July 20, 2026.',
    },
    SPECIAL_RATE: {
        id: 4,
        name: 'Special Rate',
        amount: 'For 1st 5 paying participants.',
    }
};

export default function Login() {
    const [selectedRequestType, setSelectedRequestType] = useState<any | null>(null);
    const [formData, setFormData] = useState<FormInputs>({
        fname: "",
        mname: "",
        lname: "",
        email: "",
        job_title: "",
        agency: "",
        contact: "",
        paymentFile: null,
        captcha: null
    });

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const isButtonDisabled =
        Object.entries(formData).filter(([key]) => key !== 'mname').some(([_, value]) => value === '') ||
        !formData.captcha ||
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
        data.append('job_title', formData.job_title);
        data.append('agency', formData.agency);
        data.append('contact', formData.contact);
        data.append('selectedRequestType', `${selectedRequestType?.name} - ${selectedRequestType?.amount}`);
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
                            PALO, LEYTE "5-Day MIKROTIK TRAINING BOOTCAMP ( August 10-14, 2026 8:00 AM to 5:00 PM ) @ FREQIT SOLUTIONS - LIMITED SLOTS ONLY "
                        </Typography>
                    </Box>

                    <Box sx={{ mt: 1, mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                            Official Mikrotik Certified Network Associate ( MTCNA )+ Mikrotik Certified Routing Engineer ( MTCRE )+ Mikrotik Certified User Management Engineer ( MTCUME ) Course with International Certification Exam.
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
                            id="email"
                            type="text"
                            value={formData.fname}
                            onChange={(e) => setFormData({
                                ...formData,
                                fname: e.target.value
                            })}
                        />
                    </FormControl>

                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', mt: 1 }}>Middle Initial</Typography>

                    <FormControl fullWidth size="small" margin="dense">
                        <OutlinedInput
                            id="email"
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
                            id="email"
                            type="text"
                            value={formData.lname}
                            onChange={(e) => setFormData({
                                ...formData,
                                lname: e.target.value
                            })}
                        />
                    </FormControl>

                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', mt: 1 }}>Job Title / Role <span style={{ color: 'red' }}>*</span></Typography>

                    <FormControl fullWidth size="small" margin="dense">
                        <OutlinedInput
                            id="email"
                            type="text"
                            value={formData.job_title}
                            onChange={(e) => setFormData({
                                ...formData,
                                job_title: e.target.value
                            })}
                        />
                    </FormControl>

                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', mt: 1 }}>Agency / Company <span style={{ color: 'red' }}>*</span></Typography>

                    <FormControl fullWidth size="small" margin="dense">
                        <OutlinedInput
                            id="email"
                            type="text"
                            value={formData.agency}
                            onChange={(e) => setFormData({
                                ...formData,
                                agency: e.target.value
                            })}
                        />
                    </FormControl>

                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', mt: 1 }}>Contact number <span style={{ color: 'red' }}>*</span></Typography>

                    <FormControl fullWidth size="small" margin="dense">
                        <OutlinedInput
                            id="email"
                            type="number"
                            value={formData.contact}
                            onChange={(e) => setFormData({
                                ...formData,
                                contact: e.target.value
                            })}
                        />
                    </FormControl>

                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', my: 2 }}>
                        <img src={'/assets/738774557_10164735419234244_596011779044760202_n.jpg'} style={{
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

                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', my: 1, mt: 2 }}>Payment option</Typography>

                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', my: 2, px: 0 }}>
                        <img src={'/assets/gcash-payment.png'} style={{
                            height: '100%',
                            width: '100%',
                            borderRadius: 4
                        }} />
                    </Box>

                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', mt: 2 }}>Proof of payment <span style={{ color: 'red' }}>*</span></Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Upload 1 PDF or image (max 100MB) showing a clear transaction number, date, and timestamp.</Typography>

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
