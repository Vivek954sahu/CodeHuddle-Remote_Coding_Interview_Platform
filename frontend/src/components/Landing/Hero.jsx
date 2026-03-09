import { Link } from "react-router"


const Hero = () => {
  return (
    <section id="home" className="py-16 md:py-24 bg-purple-100">
        <div className="container mx-auto px-4">
            <div className="max-w-3xl text-center mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    Seamless Remote Technical Coding Interviews
                </h1>

                <p className="text-xl text-emerald-700 mb-8">
                    Conduct real-time coding interviews with video calls, collaborative code editor, and AI powered feedback.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4">
                    <button className="bg-purple-500 hover:bg-purple-500/60 rounded-md h-11 px-8 font-medium text-[hsl(0,100%,99%)] hover:text-[hsl(0,2%,24%)]">
                        <Link to="/signup">Get Started</Link>
                    </button>
                    <button className="h-11 rounded-md px-8 bg-[hsl(240,4%,95%)] border border-[hsl(240,1%,65%)] hover:bg-purple-300 font-medium">
                        <a href="#features">Learn More</a>
                    </button>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Hero
