import UserRegistration from '@/components/UserRegistration';

export default function RegisterPage() {
  const applicationId = 'cm5telnh30001usmh643n1jb2';
  const apiKey = '9f35aa82754638026ed4c25b0600c283a2f3d85bfe0c7552';
  const apiSecret = '5229fcdf72f2310104966907b5b799823c39f952c47d10e097f64bf94a36608a';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Register for Our Application</h1>
      <UserRegistration
        applicationId={applicationId}
        apiKey={apiKey}
        apiSecret={apiSecret}
      />
    </div>
  );
}

