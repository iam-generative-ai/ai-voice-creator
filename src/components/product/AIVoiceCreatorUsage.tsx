
import { Card, CardContent } from "@/components/ui/card";

const usageCases = [
  {
    title: "พอดแคสต์ที่น่าฟัง",
    description: "สร้างพอดแคสต์คุณภาพสูงโดยไม่ต้องลงทุนในอุปกรณ์บันทึกเสียงราคาแพง"
  },
  {
    title: "หนังสือเสียง",
    description: "แปลงหนังสือหรือบทความของคุณให้เป็นหนังสือเสียงที่น่าฟังอย่างรวดเร็ว"
  },
  {
    title: "วิดีโอนำเสนอ",
    description: "เพิ่มเสียงบรรยายมืออาชีพให้กับวิดีโอพรีเซนเทชันหรือการสอนของคุณ"
  },
  {
    title: "การตลาดดิจิทัล",
    description: "สร้างโฆษณาเสียงที่ดึงดูดความสนใจสำหรับแคมเปญการตลาดของคุณ"
  },
  {
    title: "สื่อการสอน",
    description: "พัฒนาสื่อการสอนที่เข้าถึงผู้เรียนทุกรูปแบบด้วยเสียงบรรยายที่ชัดเจน"
  },
  {
    title: "เนื้อหาในหลายภาษา",
    description: "แปลงเนื้อหาของคุณให้พูดได้หลายภาษาโดยไม่ต้องจ้างนักพากย์หลายคน"
  }
];

const steps = [
  {
    number: "01",
    title: "เลือกเสียงที่ต้องการ",
    description: "เลือกจากคลังเสียงกว่า 539 เสียงที่ไม่ซ้ำกันใน 152 ภาษา"
  },
  {
    number: "02",
    title: "ป้อนข้อความหรืออัปโหลดไฟล์",
    description: "พิมพ์ข้อความที่ต้องการหรืออัปโหลดไฟล์ข้อความขนาดใหญ่"
  },
  {
    number: "03",
    title: "ปรับแต่งตามต้องการ",
    description: "ปรับความเร็ว น้ำเสียง และอารมณ์ของเสียงให้เหมาะกับเนื้อหา"
  },
  {
    number: "04",
    title: "สร้างเสียงและดาวน์โหลด",
    description: "ระบบจะประมวลผลและให้คุณดาวน์โหลดไฟล์เสียงคุณภาพสูงได้ทันที"
  }
];

const AIVoiceCreatorUsage = () => {
  return (
    <section className="mb-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        <span className="text-gradient">วิธีการใช้งานและประโยชน์</span>
      </h2>
      
      <div className="mb-16">
        <h3 className="text-2xl font-bold mb-8 text-center">AI Voice Creator เหมาะกับใครบ้าง?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {usageCases.map((item, index) => (
            <Card key={index} className="bg-gray-50 dark:bg-gray-800 border-none">
              <CardContent className="p-6">
                <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold mb-8 text-center">ขั้นตอนการใช้งานง่ายๆ</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 text-primary rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-4">
                  {step.number}
                </div>
                <h4 className="text-xl font-semibold mb-2">{step.title}</h4>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-primary/20 -z-10 transform -translate-x-8"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIVoiceCreatorUsage;
