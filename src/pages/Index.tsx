import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertCircle, CheckCircle, MessageSquare, Users, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';

// نموذج البيانات
interface Student {
  id: string;
  name: string;
  parentPhone: string;
  absences: number;
  lastAbsence?: string;
}

interface Message {
  id: string;
  from: 'school' | 'parent';
  text: string;
  timestamp: string;
  studentId: string;
}

export default function Index() {
  const [userRole, setUserRole] = useState<'school' | 'parent'>('school');
  const [selectedStudent, setSelectedStudent] = useState<string>('1');
  const [messageText, setMessageText] = useState('');
  
  // بيانات نموذجية للتلاميذ
  const [students] = useState<Student[]>([
    { id: '1', name: 'أحمد محمد', parentPhone: '+966501234567', absences: 3, lastAbsence: '2026-08-24' },
    { id: '2', name: 'فاطمة علي', parentPhone: '+966501234568', absences: 1, lastAbsence: '2026-08-20' },
    { id: '3', name: 'محمود سالم', parentPhone: '+966501234569', absences: 5, lastAbsence: '2026-08-23' },
  ]);

  // بيانات الرسائل النموذجية
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', from: 'school', text: 'السلام عليكم، نود إخبارك بغياب ابنك اليوم', timestamp: '08:30', studentId: '1' },
    { id: '2', from: 'parent', text: 'وعليكم السلام، شكراً على الإشعار', timestamp: '08:45', studentId: '1' },
    { id: '3', from: 'school', text: 'تم تسجيل الغياب في النظام', timestamp: '09:00', studentId: '1' },
  ]);

  const currentStudent = students.find(s => s.id === selectedStudent);
  const studentMessages = messages.filter(m => m.studentId === selectedStudent);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: String(messages.length + 1),
      from: userRole,
      text: messageText,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      studentId: selectedStudent,
    };

    setMessages([...messages, newMessage]);
    setMessageText('');
    toast.success('تم إرسال الرسالة بنجاح');
  };

  const handleMarkAbsence = (studentId: string) => {
    toast.success('تم تسجيل الغياب وإرسال إشعار للولي');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📚 نظام إدارة المدرسة</h1>
          <p className="text-gray-600">التواصل مع الأولياء وتسجيل الغياب</p>
        </div>

        {/* Role Selector */}
        <div className="flex gap-4 mb-8">
          <Button
            onClick={() => setUserRole('school')}
            variant={userRole === 'school' ? 'default' : 'outline'}
            className="gap-2"
          >
            <Users className="w-4 h-4" />
            المدرسة
          </Button>
          <Button
            onClick={() => setUserRole('parent')}
            variant={userRole === 'parent' ? 'default' : 'outline'}
            className="gap-2"
          >
            <AlertCircle className="w-4 h-4" />
            الولي
          </Button>
        </div>

        <Tabs defaultValue="students" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="students" className="gap-2">
              <Users className="w-4 h-4" />
              التلاميذ
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              الرسائل
            </TabsTrigger>
          </TabsList>

          {/* Tab: Students */}
          <TabsContent value="students" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Students List */}
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">قائمة التلاميذ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {students.map(student => (
                      <button
                        key={student.id}
                        onClick={() => setSelectedStudent(student.id)}
                        className={`w-full text-right p-3 rounded-lg border-2 transition-colors ${
                          selectedStudent === student.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="font-semibold text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">الغيابات: {student.absences}</p>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Student Details */}
              {currentStudent && (
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>{currentStudent.name}</CardTitle>
                      <CardDescription>معلومات التلميذ والحضور</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Student Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">رقم الولي</p>
                          <p className="font-semibold text-gray-900">{currentStudent.parentPhone}</p>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">عدد الغيابات</p>
                          <p className="font-semibold text-2xl text-red-600">{currentStudent.absences}</p>
                        </div>
                      </div>

                      {/* Absence Status */}
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-5 h-5 text-amber-600" />
                          <p className="font-semibold text-gray-900">آخر غياب</p>
                        </div>
                        <p className="text-gray-700">
                          {currentStudent.lastAbsence || 'لا توجد غيابات'}
                        </p>
                      </div>

                      {/* Attendance Stats */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">18</p>
                          <p className="text-xs text-gray-600">أيام حضور</p>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <p className="text-2xl font-bold text-red-600">{currentStudent.absences}</p>
                          <p className="text-xs text-gray-600">أيام غياب</p>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">90%</p>
                          <p className="text-xs text-gray-600">نسبة الحضور</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {userRole === 'school' && (
                        <Button
                          onClick={() => handleMarkAbsence(currentStudent.id)}
                          className="w-full bg-red-600 hover:bg-red-700 text-white"
                        >
                          <AlertCircle className="w-4 h-4 ml-2" />
                          تسجيل غياب اليوم
                        </Button>
                      )}

                      {userRole === 'parent' && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <p className="text-sm text-green-700">تم إرسال إشعارات الغياب إليك فوراً</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Tab: Messages */}
          <TabsContent value="messages" className="space-y-6">
            <Card className="h-[500px] flex flex-col">
              <CardHeader>
                <CardTitle>
                  المراسلات مع ولي {currentStudent?.name}
                </CardTitle>
              </CardHeader>
              
              {/* Messages Area */}
              <CardContent className="flex-1 overflow-y-auto space-y-4 mb-4">
                {studentMessages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p>لا توجد رسائل حتى الآن</p>
                  </div>
                ) : (
                  studentMessages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.from === userRole ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.from === userRole
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p className={`text-xs mt-1 ${msg.from === userRole ? 'text-blue-100' : 'text-gray-600'}`}>
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="اكتب رسالتك هنا..."
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* What's Next Section */}
        <Card className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-lg">🚀 الخطوات التالية</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700">
              <li>✓ إضافة قاعدة بيانات لحفظ البيانات والرسائل</li>
              <li>✓ تطبيق تسجيل الدخول والمصادقة</li>
              <li>✓ إشعارات فورية عند تسجيل الغياب</li>
              <li>✓ تقارير شهرية وسنوية للحضور</li>
              <li>✓ تطبيق موبايل مخصص للأولياء</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
