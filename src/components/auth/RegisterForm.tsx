
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface RegisterFormProps {
  onToggleForm: () => void;
}

const RegisterForm = ({ onToggleForm }: RegisterFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, isLoading } = useAuth();
  
  // Add validation states
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setEmailError(isValid ? '' : 'รูปแบบอีเมลไม่ถูกต้อง');
    return isValid;
  };

  // Validate password strength
  const validatePassword = (password: string): boolean => {
    // Password must be at least 8 characters and contain at least one letter and one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const isValid = passwordRegex.test(password);
    setPasswordError(isValid ? '' : 'รหัสผ่านต้องมีอย่างน้อย 8 ตัว และประกอบด้วยตัวอักษรและตัวเลข');
    return isValid;
  };

  // Validate matching passwords
  const validateConfirmPassword = (password: string, confirmPassword: string): boolean => {
    const isValid = password === confirmPassword;
    setConfirmPasswordError(isValid ? '' : 'รหัสผ่านไม่ตรงกัน');
    return isValid;
  };

  // Validate name
  const validateName = (name: string): boolean => {
    const isValid = name.trim().length >= 2;
    setNameError(isValid ? '' : 'ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร');
    return isValid;
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(password, confirmPassword);
    
    return isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields before submission
    if (!validateForm()) {
      return;
    }
    
    try {
      await register(email, password, name);
    } catch (error) {
      // Error is already handled in the auth context
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center">
          <span className="text-gradient">ลงทะเบียน</span>
        </CardTitle>
        <CardDescription className="text-center">
          สร้างบัญชีเพื่อใช้งานเครื่องมือ AI พากษ์เสียง
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">ชื่อ</Label>
            <Input
              id="name"
              placeholder="ชื่อของคุณ"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) validateName(e.target.value);
              }}
              required
              className={`transition-all focus:ring-2 focus:ring-primary/20 ${nameError ? 'border-destructive' : ''}`}
            />
            {nameError && <p className="text-sm text-destructive mt-1">{nameError}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">อีเมล</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) validateEmail(e.target.value);
              }}
              required
              className={`transition-all focus:ring-2 focus:ring-primary/20 ${emailError ? 'border-destructive' : ''}`}
              onBlur={() => validateEmail(email)}
            />
            {emailError && <p className="text-sm text-destructive mt-1">{emailError}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">รหัสผ่าน</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) validatePassword(e.target.value);
              }}
              required
              className={`transition-all focus:ring-2 focus:ring-primary/20 ${passwordError ? 'border-destructive' : ''}`}
              onBlur={() => validatePassword(password)}
            />
            {passwordError && <p className="text-sm text-destructive mt-1">{passwordError}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (confirmPasswordError) validateConfirmPassword(password, e.target.value);
              }}
              required
              className={`transition-all focus:ring-2 focus:ring-primary/20 ${confirmPasswordError ? 'border-destructive' : ''}`}
              onBlur={() => validateConfirmPassword(password, confirmPassword)}
            />
            {confirmPasswordError && <p className="text-sm text-destructive mt-1">{confirmPasswordError}</p>}
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading || !!(nameError || emailError || passwordError || confirmPasswordError)}
          >
            {isLoading ? 'กำลังสร้างบัญชี...' : 'ลงทะเบียน'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          มีบัญชีอยู่แล้ว?{' '}
          <Button variant="link" className="p-0 h-auto" onClick={onToggleForm}>
            เข้าสู่ระบบ
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
