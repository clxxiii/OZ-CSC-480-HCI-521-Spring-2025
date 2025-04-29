const CommunityGuidelinesPage = () => {

    return (
        <div className="container mt-4">
            <h1 className="text-start" style={{fontWeight:"bold"}}>
                Welcome to <span style={{color:"#146C43"}}>Quotable</span> <span style={{fontSize:18, fontWeight:"normal"}}>- a learning space created by SUNY Oswego Students.</span>
            </h1>
            <h5 className="text-start" style={{fontStyle:"italic", fontWeight:"normal"}}>
                Who we are and What we do:
            </h5>
            <p className="text-start" style={{fontStyle:"italic"}}>
                The Quotable team is composed of SUNY Oswego’s Senior undergrad and grad students alike, Each split up into teams to create something bigger than ourselves. What started as a simple idea prompt from the stakeholders/professors quickly turned into a platform where students, professors, and anyone in between can discover, share, and archive quotes. These quotes are meant to inspire, provoke thought, or simply make you smile! Whether it's something brilliant a professor said in class, a quote from your favorite author, or a phrase you made up yourself, Quotable gives you a place to keep it and share it with others. 
            </p>
            <p className="text-start" style={{fontStyle:"italic"}}>
                We believe that great quotes shouldn’t be forgotten, and everyone has something worth quoting. So whether you're here to browse, post, or just find that one perfect line – welcome to the Quotable community!
            </p>
            <br/>
            <h4 className="text-start" style={{fontWeight:"bold"}}>
                Community Guidelines
            </h4>
            <p className="text-start" style={{fontStyle:"italic"}}>
                Failure to comply with these community guidelines could result in the block/removal of the quote or the user.
                We request that all users are respectful towards each other and use the application the way it is intended to use.
                If you find any content that violates our guidelines, please use the report feature to notify us.
                Your help is really important to keeping our community safe and enjoyable.
            </p>
            <ul className="text-start" style={{fontStyle:"italic"}}>
                <li>Any form of bullying, harassment, or hate speech is strictly prohibited on Quotable</li>
                <li>Personal information such as phone number, location, or address that violates any individual’s privacy, whether they are a user or not, must not be posted on Quotable</li>
                <li>A user must not advertise any products on Quotable</li>
                <li>Promoting any illegal activity or content is prohibited</li>
                <li>When uploading a quote on Quotable, users must correctly identify the author of the quote to protect their intellectual property</li>
                <li>Do not plagiarize or claim other’s quotes as your own; if you do not know the author, please label “author unknown”.</li>
                <li>A user must not upload any viruses or hyperlinks into Quotable</li>
                <li>A user must not impersonate any other individual on this application via hacking or by using their name</li>

            </ul>

        </div>
    );

};

export default CommunityGuidelinesPage;