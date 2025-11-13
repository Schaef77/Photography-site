import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import FadeInWrapper from '../../components/FadeInWrapper';
import ContactContent from '../../components/ContactContent';

export default function Contact() {
  return (
    <FadeInWrapper>
      <div
        className="min-h-screen"
        style={{
          backgroundColor: '#141414'
        }}
      >
        <Navbar />
        <ContactContent />
        <Footer showInquiriesButton={false} />
      </div>
    </FadeInWrapper>
  );
}
