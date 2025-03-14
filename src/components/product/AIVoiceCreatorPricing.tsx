
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  "เสียงคุณภาพสูงที่สมจริงราวกับมนุษย์",
  "รองรับ 152 ภาษาทั่วโลก",
  "539 เสียงไม่ซ้ำกัน",
  "ปรับแต่งน้ำเสียงและอารมณ์ได้",
  "รองรับ SSML สำหรับการควบคุมขั้นสูง",
  "สร้างเสียงพากย์ได้ยาวถึง 10 นาที",
  "ดาวน์โหลดได้ไม่จำกัด",
  "อัปเดตเสียงใหม่ทุกเดือน",
  "การสนับสนุนทางเทคนิคตลอด 24 ชั่วโมง"
];

const AIVoiceCreatorPricing = () => {
  const navigate = useNavigate();
  
  const handleRedirectToAuth = () => {
    navigate('/auth');
  };

  return (
    <section className="mb-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        <span className="text-gradient">แพ็คเกจราคาสุดคุ้ม</span>
      </h2>
      
      <div className="flex justify-center">
        <Card className="w-full max-w-2xl border-2 border-primary shadow-lg transform transition-all duration-300 hover:scale-105">
          <div className="bg-primary text-white text-center py-4">
            <h3 className="text-2xl font-bold">แพ็คเกจพรีเมียม</h3>
          </div>
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <p className="text-gray-500 line-through text-lg">ปกติ 990 บาท/เดือน</p>
              <div className="flex justify-center items-end mt-2">
                <span className="text-5xl font-bold text-primary">590</span>
                <span className="text-xl ml-2 mb-1">บาท/เดือน</span>
              </div>
              <p className="text-sm mt-2 text-gray-600">จ่ายรายปีประหยัดมากกว่า 20%</p>
            </div>
            
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <p>{feature}</p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-0 flex justify-center">
            <Button 
              onClick={handleRedirectToAuth} 
              size="lg" 
              className="w-full text-lg py-6 h-auto"
            >
              เริ่มใช้งานทันที
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="text-center mt-8 text-gray-600 dark:text-gray-400">
        <p>ยกเลิกได้ทุกเมื่อ ไม่มีข้อผูกมัด • รับประกันคืนเงินภายใน 14 วัน</p>
      </div>
    </section>
  );
};

export default AIVoiceCreatorPricing;
