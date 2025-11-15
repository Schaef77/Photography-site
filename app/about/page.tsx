import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import FadeInWrapper from '../../components/FadeInWrapper';
import AboutContent from '../../components/AboutContent';
import blurData from '../../data/about-blur-data.json';

export default function About() {
  const sections = [
    {
      image: '/images/about-shot/suitshot.JPG',
      blurDataURL: blurData['suitshot.JPG'],
      text: 'Adrian Schaefer, a native of Vancouver, British Columbia, developed a profound appreciation for the outdoors, influenced by the surrounding ocean and mountains. Currently, he is pursuing his studies at Thompson Rivers University in Kamloops.',
      imageOnLeft: true
    },
    {
      image: '/images/about-shot/camerashot.jpeg',
      blurDataURL: blurData['camerashot.jpeg'],
      text: 'Utilizing a Fujifilm XT-4 camera, with his current favourite a 35mm f/2 prime lens, he specializes in landscape, street, and portrait photography while also experimenting with sports photography.',
      imageOnLeft: false
    },
    {
      image: '/images/about-shot/sportshot.jpeg',
      blurDataURL: blurData['sportshot.jpeg'],
      text: 'Adrian strives to present the world from a unique perspective, influenced by his experiences in diverse environments.',
      imageOnLeft: true
    },
    {
      image: '/images/about-shot/birdshot.jpeg',
      blurDataURL: blurData['birdshot.jpeg'],
      text: 'From a young age, he found pleasure in capturing the world from his lens and is eager to share this vision with others.',
      imageOnLeft: false
    },
    {
      image: '/images/about-shot/cornshot.JPG',
      blurDataURL: blurData['cornshot.JPG'],
      text: 'Visitors are encouraged to explore his galleries and reach out for potential collaborations or projects.',
      imageOnLeft: true
    }
  ];

  return (
    <FadeInWrapper>
      <div
        className="min-h-screen"
        style={{
          backgroundColor: '#141414'
        }}
      >
        <Navbar />
        <AboutContent sections={sections} />
        <Footer />
      </div>
    </FadeInWrapper>
  );
}
