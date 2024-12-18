import React from 'react';

const ErrorPage = () => {
  return (
    <section className="page_404 py-10 bg-white font-serif">
      <div className="container mx-auto">
        <div className="row">
          <div className="col-sm-12">
            <div className="col-sm-10 col-sm-offset-1 text-center">
              <div className="four_zero_four_bg bg-cover bg-center h-96" style={{ backgroundImage: "url('https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif')" }}>
                <h1 className="text-6xl text-black">404</h1>
              </div>
              <div className="contant_box_404 mt-[50px]">
                <h3 className="text-5xl font-bold text-gray-800">Look like you're lost</h3>
                <p className="text-lg text-gray-600">The page you are looking for is not available!</p>
                <a href="/" className="link_404 inline-block mt-4 py-2 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600">
                  Go to Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;

