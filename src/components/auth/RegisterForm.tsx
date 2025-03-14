
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface RegisterFormProps {
  onToggleForm: () => void;
}

const RegisterForm = ({ onToggleForm }: RegisterFormProps) => {
  const handleRedirectToLine = () => {
    window.open('https://line.me/ti/p/Pq7cizlrXb', '_blank');
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center">
          <span className="text-gradient">ลงทะเบียน</span>
        </CardTitle>
        <CardDescription className="text-center">
          กรุณาติดต่อผู้ดูแลระบบเพื่อขอบัญชีผู้ใช้งาน
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-center text-muted-foreground">
            การลงทะเบียนจำเป็นต้องได้รับการอนุมัติจากผู้ดูแลระบบ
            กรุณาคลิกปุ่มด้านล่างเพื่อติดต่อผู้ดูแลระบบผ่าน Line
          </p>
          <Button 
            onClick={handleRedirectToLine} 
            className="w-full bg-[#06C755] hover:bg-[#06B64D]"
          >
            ติดต่อผู้ดูแลระบบผ่าน Line
          </Button>
        </div>
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
