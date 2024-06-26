import Header from '../../components/Headers';
import Footer from '../../components/Footers';
import ScrollToTop from '../../components/ScrollToTop';
import videoImg from '../../assets/img/Video.png';
import image from '../../assets/img/Image.png';
import card from '../../assets/img/Card.png';
import { BiLike, BiTimeFive } from 'react-icons/bi';
import { BsFillBookmarkFill, BsBookmark } from 'react-icons/bs';
import propTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import http from '../../helpers/http';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Article = ({ id, picture, title, descriptions, likeCount, createdAt }) => {
  const token = useSelector((state) => state.auth.token);
  const [isSaved, setIsSaved] = useState(localStorage.getItem(`saved_${id}`) === 'true');

  async function handleSave() {
    if (!token) {
      toast.error('You have to login first');
    }
    try {
      if (!isSaved) {
        await http(token).post(`/saved-article/${id}`);
        setIsSaved(true);
        localStorage.setItem(`saved_${id}`, 'true');
      } else {
        await http(token).delete(`/saved-article/${id}`);
        setIsSaved(false);
        localStorage.setItem(`saved_${id}`, 'false');
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div
      key={id}
      className="flex bg-white w-[416px] rounded-3xl gap-8 drop-shadow-2xl hover:scale-[1.05] cursor-pointer duration-200"
    >
      <div className="flex justify-between items-center flex-col lg:flex-row gap-10 py-10">
        <Link to={`/articleView/${id}`} className="w-full h-[222px] rounded-3xl overflow-hidden bg-green-400">
          <img src={picture} className="w-[100%] h-full object-cover" alt="" />
        </Link>
        <div className="flex px-5">
          <div className="flex flex-col gap-8">
            <Link to={`/articleView/${id}`} className="flex flex-col gap-4">
              <div className="text-[#444cd4] text-[20px] leading-[20px] ">{title}</div>
              <div className="text-[18px] leading-[20px] font-medium ">{descriptions}</div>
            </Link>
            <div className="flex gap-4">
              <div className="flex gap-2 items-center">
                <div>
                  <BiLike />
                </div>
                <div>{likeCount}</div>
              </div>
              <div className="flex gap-2 items-center">
                <div>
                  <BiTimeFive />
                </div>
                <div>{moment(createdAt).fromNow('mm')} ago</div>
              </div>
              <button onClick={handleSave}>{isSaved ? <BsFillBookmarkFill color="blue" /> : <BsBookmark />}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Article.propTypes = {
  id: propTypes.string,
  picture: propTypes.string,
  title: propTypes.string,
  descriptions: propTypes.string,
  likeCount: propTypes.string,
  createdAt: propTypes.string,
};

const Home = () => {
  const [article, setArticle] = useState([]);
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function getArticle() {
      const { data } = await http().get('/articles?limit=6');
      setArticle(data.results);
    }
    getArticle();
  }, []);

  useEffect(() => {
    async function getCategory() {
      const { data } = await http().get('/articlesCategories?limit=100');
      setCategory(data.results);
    }
    getCategory();
  }, []);

  const getCategories = (data) => {
    navigate('/categoryarticles', {
      state: {
        categories: data,
      },
    });
  };

  return (
    <>
      <div className="h-min-screen">
        <nav>
          <Header />
        </nav>
        <main>
          <div className="w-full">
            <div className="flex flex-col w-full">
              <div className="flex flex-col h-full">
                <div className="flex flex-col w-full pt-20 h-[700px] bg-[url('/src/assets/img/bg-main.jpg')] bg-cover bg-no-repeat">
                  <div className="flex items-center h-full px-8 md:px-20">
                    <div className="max-w-3xl text-white">
                      <div className="text-5xl md:text-[65px] leading-[74px]">Share Information</div>
                      <div className="text-5xl md:text-[65px] leading-[74px]">and Educate People</div>
                      <div className="md:text-[20px] leading-[32px]">
                        Everyone has their point of view of something, but just don&apos;t be afraid to express the
                        facts. Be an author and share you prespective of something to the world.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-white">
            <div className="flex flex-col gap-8">
              <div className="flex justify-between font-semibold">
                <div>Popular</div>
                <div className="text-[#444cd4] cursor-pointer">More</div>
              </div>
              <div className="flex gap-16 font-semibold text-[#444cd4] cursor-pointer flex-wrap">
                <div className="hover:text-black">#ladygaga</div>
                <div className="hover:text-black">#jokowidodo</div>
                <div className="hover:text-black">#dayniki</div>
                <div className="hover:text-black">#ladygaga</div>
                <div className="hover:text-black">#jokowidodo</div>
                <div className="hover:text-black">#dayniki</div>
                <div className="hover:text-black">#jokowidodo</div>
                <div className="hover:text-black">#ladygaga</div>
              </div>
              <div className="flex flex-col gap-8 pt-[60px]">
                <div className="flex justify-between font-semibold">
                  <div>Category</div>
                  <Link to="/categoryarticles">
                    <div className="text-[#444cd4] cursor-pointer">More</div>
                  </Link>
                </div>
                <div className="flex justify-center items-center">
                  <div className="flex justify-center items-center w-full max-w-5xl">
                    <div className="flex flex-wrap justify-center items-center gap-14">
                      {category.map((category) => {
                        return (
                          <div key={`category-${category.id}`}>
                            <div className="flex flex-col items-center gap-4 drop-shadow-2xl hover:scale-[1.1] duration-200">
                              <div
                                onClick={() => {
                                  getCategories(category.name);
                                }}
                                className="w-[202px] h-[222px] rounded-3xl overflow-hidden relative cursor-pointer"
                              >
                                <img
                                  src={category.picture}
                                  className="w-full h-full object-cover"
                                  alt={category.name}
                                />
                              </div>
                              <div
                                onClick={() => {
                                  getCategories(category.name);
                                }}
                                className="text-[20px] font-bold hover:text-primary cursor-pointer"
                              >
                                {category.name}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-8 pt-[20px]">
                <div className="flex justify-between font-semibold px-10">
                  <div>Recomended</div>
                  <div className="text-[#444cd4] cursor-pointer">More</div>
                </div>
                <div className="flex flex-wrap justify-center items-center gap-14 px-10 py-20">
                  {article.map((article) => {
                    return (
                      <Article
                        key={article.id}
                        id={article.id}
                        picture={article.picture}
                        title={article.title}
                        descriptions={article.descriptions}
                        likeCount={article.likeCount}
                        createdAt={article.createdAt}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#D7DDEC] px-32 py-32">
            <div className="flex justify-center w-full ">
              <div className="flex gap-32">
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-4">
                    <div className="font-bold text-[36px] leading-[56px]  ">
                      Let&apos;s hear about <br /> Kayla&apos;s success story
                    </div>
                    <div className="font-medium">
                      See how well News Today works in a <br /> real user&apos; life.{' '}
                    </div>
                  </div>
                  <div className="bg-[#444cd4] hover:bg-[#6261df] text-white w-[180px] h-16 flex items-center justify-center rounded-xl">
                    <button>Let’s get started</button>
                  </div>
                </div>
                <div>
                  <img src={videoImg} alt="picture" />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#ffffff] px-32 py-32">
            <div className="flex w-full justify-center items-center flex-wrap gap-16">
              <div className="flex relative">
                <img src={image} />
                <div className="absolute -inset-x-20 -bottom-20">
                  <img src={card} alt="picture" />
                </div>
              </div>
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                  <div className="font-medium">Our Product</div>
                  <div className="font-bold text-[36px] leading-[56px]  ">
                    You tell us some facts, <br /> We help you to make your <br /> article
                  </div>
                  <div className="font-medium">
                    Everyone has their own facts, and in different ways. <br />
                    Let Click News helps you to be a good author to <br />
                    educate people just by reading your article.
                  </div>
                </div>
                <div className="bg-[#444cd4] hover:bg-[#6261df] text-white w-[180px] h-16 flex items-center justify-center rounded-xl">
                  <button className="text-white">Start Exploring</button>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white px-[60px] pt-[65px] pb-[150px]">
            <div className="flex flex-col gap-8">
              <div className="font-bold text-[24px]">Latest News</div>
              <div className="flex flex-wrap gap-14 justify-center items-center">
                {article.map((article) => {
                  return (
                    <Article
                      key={article.id}
                      id={article.id}
                      picture={article.picture}
                      title={article.title}
                      descriptions={article.descriptions}
                      likeCount={article.likeCount}
                      createdAt={article.createdAt}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
      <ScrollToTop />
    </>
  );
};

export default Home;
