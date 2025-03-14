
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Mic, Headphones, Clock, Globe } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 text-center relative">
          <div className="hero-glow"></div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl mx-auto">
            <span className="text-gradient">AI Voice Creator</span><br />
            ปลดปล่อยพลังแห่งเสียงด้วย AI
          </h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
            เปลี่ยนข้อความให้เป็นเสียงพากย์คุณภาพสูงที่สมจริงด้วยเทคโนโลยี AI สุดล้ำ
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Button size="lg" className="text-lg px-8" onClick={() => navigate('/ai-voice-creator')}>
              ดูรายละเอียด
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8" onClick={() => navigate('/auth')}>
              เริ่มต้นใช้งาน
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 text-primary rounded-full p-4 mb-4">
                <Mic size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">เสียงสมจริง</h3>
              <p className="text-gray-600 dark:text-gray-400">เสียงที่สมจริงราวกับมนุษย์ ด้วยน้ำเสียงที่เป็นธรรมชาติ</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 text-primary rounded-full p-4 mb-4">
                <Globe size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">152 ภาษา</h3>
              <p className="text-gray-600 dark:text-gray-400">รองรับ 152 ภาษาทั่วโลกและ 539 เสียงที่ไม่ซ้ำกัน</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 text-primary rounded-full p-4 mb-4">
                <Headphones size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">คุณภาพสูง</h3>
              <p className="text-gray-600 dark:text-gray-400">เสียงคุณภาพสูงระดับ HD ไร้สัญญาณรบกวน</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 text-primary rounded-full p-4 mb-4">
                <Clock size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">พากย์ได้ยาว</h3>
              <p className="text-gray-600 dark:text-gray-400">สร้างเสียงพากย์ได้ยาวถึง 10 นาทีต่อครั้ง</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">พร้อมที่จะเริ่มต้นหรือยัง?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-gray-700 dark:text-gray-300">
            เริ่มต้นใช้งาน AI Voice Creator ได้ทันทีวันนี้และค้นพบประสบการณ์ใหม่ในการสร้างเสียงพากย์
          </p>
          <Button size="lg" className="text-lg px-8" onClick={() => navigate('/ai-voice-creator')}>
            ดูรายละเอียดบริการ
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400">
              © 2023 AI Voice Creator. สงวนลิขสิทธิ์.
            </p>
            <div className="flex gap-8 mt-4 md:mt-0">
              <Button variant="link" onClick={() => navigate('/ai-voice-creator')} className="text-gray-600 dark:text-gray-400 hover:text-primary">บริการ</Button>
              <Button variant="link" onClick={() => navigate('/ai-voice-creator')} className="text-gray-600 dark:text-gray-400 hover:text-primary">ราคา</Button>
              <Button variant="link" onClick={() => navigate('/auth')} className="text-gray-600 dark:text-gray-400 hover:text-primary">เข้าสู่ระบบ</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
