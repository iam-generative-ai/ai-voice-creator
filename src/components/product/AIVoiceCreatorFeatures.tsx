
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Globe, Sliders, Code, Clock, Star } from "lucide-react";

const features = [
  {
    icon: <Mic className="h-10 w-10" />,
    title: "เสียงสมจริงราวกับมนุษย์",
    description: "ลืมเสียงหุ่นยนต์แข็งๆ ไปได้เลย! AI ของเราสร้างเสียงที่ใกล้เคียงกับการพูดของมนุษย์อย่างเหลือเชื่อ ด้วยน้ำเสียงที่เป็นธรรมชาติและลื่นไหล รับรองว่าผู้ฟังของคุณจะต้องทึ่งทุกครั้งที่ได้ยิน!"
  },
  {
    icon: <Globe className="h-10 w-10" />,
    title: "พูดได้ทุกภาษาเพื่อทุกคนทั่วโลก",
    description: "อยากสื่อสารกับคนทั้งโลก? ไม่มีปัญหา! AI Voice Creator รองรับถึง 152 ภาษา และมี 539 เสียงไม่ซ้ำกัน ไม่ว่าจะเป็นสำเนียงอเมริกันชัดๆ หรือน้ำเสียงฝรั่งเศสไพเราะ คุณจะพบตัวเลือกที่ลงตัวสำหรับทุกความต้องการ!"
  },
  {
    icon: <Sliders className="h-10 w-10" />,
    title: "ปรับแต่งได้ตามใจคุณ",
    description: "ทำไมต้องยอมรับอะไรธรรมดา ในเมื่อคุณสร้างสิ่งพิเศษได้? ด้วยการตั้งค่า AI ขั้นสูง คุณสามารถปรับความเร็ว เพิ่มอารมณ์ หรือเปลี่ยนสไตล์ได้ตามต้องการ เหมือนมีนักพากย์ส่วนตัวที่พร้อมทำตามคำสั่งคุณทุกอย่าง!"
  },
  {
    icon: <Code className="h-10 w-10" />,
    title: "ควบคุมได้แม่นยำด้วย SSML",
    description: "สำหรับคนที่ใส่ใจทุกรายละเอียด AI Voice Creator รองรับ SSML (Speech Synthesis Markup Language) ช่วยให้คุณปรับการออกเสียง น้ำเสียง และจังหวะได้อย่างละเอียด คุณภาพระดับมืออาชีพอยู่ใกล้แค่ปลายนิ้ว!"
  },
  {
    icon: <Clock className="h-10 w-10" />,
    title: "พากย์ได้ยาวถึง 10 นาที",
    description: "มีเรื่องยาวๆ อยากเล่า? เราพร้อมซัพพอร์ต! สร้างเสียงพากย์ได้นานถึง 10 นาที เหมาะสำหรับพอดแคสต์ หนังสือเสียง หรือพรีเซนเทชันที่ต้องการความสมบูรณ์แบบ ปลดปล่อยความคิดสร้างสรรค์ได้เต็มที่โดยไม่ต้องตัดทอน!"
  },
  {
    icon: <Star className="h-10 w-10" />,
    title: "คุณภาพสูงสุด",
    description: "คุณภาพเสียงระดับ HD ที่ทำให้ผลงานของคุณโดดเด่นและน่าประทับใจ ด้วยเทคโนโลยี AI ล่าสุดที่ให้ผลลัพธ์คมชัด ไร้สัญญาณรบกวน"
  }
];

const AIVoiceCreatorFeatures = () => {
  return (
    <section className="mb-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        <span className="text-gradient">อะไรที่ทำให้ AI Voice Creator โดดเด่น?</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="rounded-full bg-primary/10 p-3 w-fit mb-6 text-primary">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default AIVoiceCreatorFeatures;
