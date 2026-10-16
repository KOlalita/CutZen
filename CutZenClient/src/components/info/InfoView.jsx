import React, { useEffect, useState } from 'react';
import { ChevronRight, Clock3, MapPin, Phone } from 'lucide-react';
import { api } from '../../api/client';
import { LoadingState } from '../shared/LoadingState';
import { ErrorState } from '../shared/ErrorState';
import { Card } from '../shared/Card';

const iconMap = { Clock3, MapPin, Phone };

export function InfoView({ expandedInfo, onToggleInfo }) {
  const [infoItems, setInfoItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getStudioInfo()
      .then((data) => setInfoItems(data.map((item) => ({ ...item, icon: iconMap[item.icon] || MapPin }))))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-stone-900">Studio info</h2>
        <p className="mt-1 text-sm text-stone-500">Everything about CutZen</p>
      </div>

      <div className="space-y-3">
        {infoItems.map(({ title, detail, icon: Icon }) => {
          const open = expandedInfo === title;
          return (
            <Card key={title} className="border border-stone-200 p-5">
              <button onClick={() => onToggleInfo(title)} className="flex w-full items-center justify-between text-left">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 text-amber-600 group-hover:from-amber-100 group-hover:to-orange-100 transition-all">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900">{title}</h3>
                    <p className="text-sm text-stone-500">Tap to expand</p>
                  </div>
                </div>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-400 transition-all group-hover:bg-amber-50 group-hover:text-amber-600 ${open ? 'rotate-90' : ''}`}>
                  <ChevronRight className="h-5 w-5" />
                </div>
              </button>
              {open && (
                <div className="mt-4 rounded-xl bg-gradient-to-r from-stone-50 to-amber-50/30 p-4 border border-stone-100">
                  <p className="text-sm font-medium text-stone-700">{detail}</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <FeatureCard icon={MapPin} title="Find us on the map" description="Located in the heart of Brooklyn. Easy parking available." buttonText="Get directions" />
      <FeatureCard icon={Phone} title="Need help?" description="Our team is available during business hours." buttonText="Call studio" href="tel:+17185550147" />
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, buttonText, href }) {
  const Wrapper = href ? 'a' : 'button';
  return (
    <Card className="border border-stone-200 p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-600">
          <Icon className="h-7 w-7" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-stone-900">{title}</h3>
          <p className="mt-1 text-sm text-stone-500">{description}</p>
          <Wrapper href={href} className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-100 transition-colors">
            {buttonText}
            <ChevronRight className="h-4 w-4" />
          </Wrapper>
        </div>
      </div>
    </Card>
  );
}