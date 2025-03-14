
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AIVoiceCreatorHeader = () => {
  const navigate = useNavigate();
  
  const handleRedirectToAuth = () => {
    navigate('/auth');
  };

  return (
    <section className="text-center mb-16 relative">
      <div className="hero-glow"></div>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
        <span className="text-gradient">🌟 AI Voice Creator 🌟</span>
      </h1>
      <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto text-balance">
        ปลดปล่อยพลังแห่งคำพูดด้วยเทคโนโลยีสุดล้ำ!
      </p>
      <div className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
        <p>
          ลองนึกภาพการเปลี่ยนข้อความธรรมดาให้กลายเป็น เสียงพากย์ที่สมจริงและมีคุณภาพสูง 
          เพียงแค่คลิกไม่กี่ครั้ง—ฟังดูเหมือนฝันใช่ไหม? แต่กับ AI Voice Creator 
          มันไม่ใช่แค่ฝัน มันคือความจริงที่คุณสัมผัสได้! 🎤✨
        </p>
        <p className="mt-4">
          ไม่ว่าคุณจะสร้างพอดแคสต์ พากย์หนังสือเสียง หรือทำพรีเซนเทชันสุดปัง 
          เครื่องมือสุดล้ำนี้คือเพื่อนคู่ใจที่จะทำให้ไอเดียของคุณ มีชีวิต ด้วยเสียง! 🔊💡
        </p>
      </div>
      <Button 
        onClick={handleRedirectToAuth} 
        size="lg" 
        className="text-lg px-8 py-6 h-auto animate-pulse"
      >
        ทดลองใช้ฟรีวันนี้!
      </Button>
    </section>
  );
};

export default AIVoiceCreatorHeader;
