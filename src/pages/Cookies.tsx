import Layout from '@/components/layout/Layout';

const Cookies = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
        
        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">What Are Cookies</h2>
            <p className="text-muted-foreground">
              Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and analyzing how you use our site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-2">Essential Cookies</h3>
                <p className="text-muted-foreground">
                  These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">Analytics Cookies</h3>
                <p className="text-muted-foreground">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">Functional Cookies</h3>
                <p className="text-muted-foreground">
                  These cookies allow the website to remember choices you make and provide enhanced, more personal features.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">Advertising Cookies</h3>
                <p className="text-muted-foreground">
                  These cookies may be set through our site by our advertising partners to build a profile of your interests and show you relevant ads.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Managing Cookies</h2>
            <p className="text-muted-foreground mb-4">
              You can control and manage cookies in various ways:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Browser settings: Most browsers allow you to refuse cookies or delete existing ones</li>
              <li>Cookie preferences: You can adjust your preferences using our cookie banner</li>
              <li>Opt-out tools: You can use industry opt-out tools for advertising cookies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Third-Party Cookies</h2>
            <p className="text-muted-foreground">
              We may use third-party services that set their own cookies. These include analytics providers, advertising networks, and social media platforms. Please refer to their respective privacy policies for more information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Updates to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about our use of cookies, please contact us through our support channels.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Cookies;