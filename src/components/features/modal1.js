import React from "react";

const Modal = (props) => {
    // const [isShow, setIsShow] = useState(true)
    return(
        <div id="defaultModal" tabIndex="-1" aria-hidden="true" className={`${props.modalShow ? "": "hidden"} fixed top-0 left-0 right-0 z-50 w-auto p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full items-center`}>
            <div className="relative w-full h-full max-w-full md:h-auto">
                <div className="relative bg-white rounded-lg shadow">
                    <div className="flex items-start justify-between p-4 border-b rounded-t">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Maltiti A. Enterprise Limited
                        </h3>
                        <div onClick={props.onClick} className="text-gray-400 bg-transparent hover:bg-red-200 cursor-pointer hover:text-red-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </div>
                    </div>
                    <div className="p-6 space-y-6">
                        <h1 className="font-bold text-lg">Rabiatu Abukari</h1>
                        <p>
                            Founder and CEO Rabiatu Gurunpaga Abukari started Maltiti A. Enterprise Limited as a very small business two decades ago.
                            Rabiatu is an inspiring woman. She makes sure that over 5000 women produce good quality products, she trains them, and she is on a mission of
                            mechanizing the manual processes.<br/> Because of her commitment the women earn more and the level of education and prosperity increases. In addition,
                            Rabiatu helps the women with mobile savings as well as health insurance. The growth of the company creates new communities, allowing more women to work. 
                            Part of the proceeds are used to send children to school. <br/>Rabiatu: “We’re at a major turning point with Maltiti. 
                            In recent years we have worked hard to get the production of shea butter and black soap off the ground. 
                            Thanks to the efforts of hundreds of strong Ghanaian women we have succeeded. In the coming years, we want to continue to build 
                            on the quality of our products. In the first instance, we will focus on our home market in Ghana. Of course, we also want to play
                            an increasing role in the international markets in the long term.”
                        </p>
                        <br/>
                        <h1 className="font-bold text-lg">Products</h1>
                        <p>
                            The company has been instrumental in the processing, marketing and distribution of shea butter, shea butter based products (soap, lotion, creams, pomade) 
                            rice, soya, other non-timber forest products (Baobab, dawadawa), essential oils such as kapok, moringa, baobab, mango, shea, neem, groundnut paste, kombo butter and many other organic products.
                            The company is very much purpose driven. It is not just about making profit; it is also about improving the lives of thousands of families. <br/>
                        </p><br/>
                        <h1 className="font-bold text-lg">Farming</h1>
                        <p>
                            Maltiti A. Enterprise Limited started Maltiti farms in 2018. The company total farm size as at April, 2021 is 307 acres. 
                            The main crops we cultivate includes maize, rice, soy. The company aim is to expand Maltiti farms to 2000 acres by the year 2023.
                        </p><br/>
                        <h1 className="font-bold text-lg">Mission Statement</h1>
                        <p>
                            Improve lives of women in Northern Ghana with the power of shea nut and other organic products.
                        </p><br/>
                        <h1 className="font-bold text-lg">Maltiti's Vision</h1>
                        <p className="">
                            The biggest exporter of shea butter and other essential organic products across the globe.
                        </p>
                        <h1 className="font-bold text-lg">Maltiti main Objectives</h1>
                        <ul className="list-disc ml-[5%]">
                            <li>Training and empowering shea cooperatives as well providing them good market.</li>
                            <li>Production of cosmetics derived from shea butter and export.</li>
                            <li>Production of natural oils and export.</li>
                            <li>Free soap making training to disable groups.</li>
                            <li>Farming and supply of rice, soy and maize.</li>
                            <li>Provide start-up capital to shea butter producers.</li>
                        </ul>
                        <h1 className="font-bold text-lg">Core values of the company</h1>
                        <ul className="list-disc ml-[5%]">
                            <li>Meeting customers’ orders and time lines.</li>
                            <li>Respect and value the contribution of women towards community development.</li>
                            <li>Protect and preserve shea trees for the future generations.</li>
                        </ul><br/>
                        <h1 className="font-bold text-lg">Certification</h1>
                        <p>
                            Within the Maltiti shea value chain, ten shea collection cooperatives and five shea butter producing centres are organic, Fair Trade 
                            and Fairtrade Sustainability Alliance certified. All our products is certified by Ghana Standard Authority and Food and Drug Authority.
                        </p>
                        <h1 className="font-bold text-lg">Partnerships</h1>
                        <p>
                            Currently Maltiti A Enterprise works with Ripples foundation, MEDA, PUM, SNV, the Global Shea Alliance to reach out to many women in the shea value chain. As at April,2021, the total number
                            of registered shea nut collectors were 2,040 who are from 19 different communities. The Shea butter producers are 644 women from 13 communities.
                        </p>
                    </div>
                    
                    <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <button onClick={props.onClick} className="text-white bg-red-700 hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center">Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;