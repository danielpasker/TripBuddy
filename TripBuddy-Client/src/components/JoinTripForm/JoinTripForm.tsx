import {FC, ReactNode, useCallback, useState} from 'react';
import {FormProvider} from 'react-hook-form';
import {toast} from 'react-toastify';
import {AdvancedFiltersStep} from '@components/JoinTripForm/AdvancedFiltersStep/AdvancedFiltersStep';
import {BasicFiltersStep} from '@components/JoinTripForm/BasicFiltersStep/BasicFiltersStep';
import {MatchmakingResultsStep} from '@components/JoinTripForm/SearchResultsStep/MatchmakingResultsStep';
import {DestinationStep} from '@components/NewTripForm/DestinationStep';
import {StyledButton} from '@components/common/StyledButton';
import {Trip} from '@customTypes/Trip';
import {useMutation} from '@hooks/useMutation';
import {useValidatedForm} from '@hooks/useValidatedSchema';
import {getMatches} from '@services/tripsApi';
import {JoinTripSchemaType, joinTripSchema} from './form';

// TODO: remove this test data after implementing the API results
const TEST_DATA: Trip = {
  _id: '6823ae6749172d2c8060712b',
  startDate: '2025-05-13',
  endDate: '2025-05-21',
  users: [
    {
      _id: '68178774556b049a50df2b90',
      userName: 'danielpasker',
      profileImageUrl: null,
      description: 'Thats my new description',
      age: 22,
      gender: 'Male',
      religion: 'Islam',
      diet: 'Vegan',
    },
    {
      _id: '68178774557b049a50df2b90',
      userName: 'gayaVishna',
      profileImageUrl: null,
      description: 'Thats my old description',
      age: 24,
      gender: 'Female',
      religion: 'Hindu',
      diet: 'Vegetarian',
    },
    {
      _id: '68178784557b049a50df2b90',
      userName: 'ronyHagver',
      profileImageUrl: null,
      description: 'Thats my future description',
      age: 34,
      gender: 'Male',
      religion: 'Christianity',
      diet: 'Kosher',
    },
  ],
  plan: {
    location: 'Rome',
    countryCode: 'IT',
    days: 8,
    budget: '200 EUR',
    participants: 3,
    tripType: 'Cultural',
    plan: [
      {
        day: 1,
        activities: [
          {
            activity:
              'Begin your Roman adventure with a visit to the Colosseum, the iconic amphitheater of the Roman Empire. Immerse yourself in the history of gladiatorial combats and public spectacles that once unfolded within its walls, taking your time to imagine the grandeur of ancient Rome. The exterior is free to see, allowing you to appreciate its architectural marvel without spending any of your limited budget.',
            location: 'Colosseum',
            isValid: true,
          },
          {
            activity:
              "Next, walk to the Roman Forum, the heart of ancient Rome's political, religious, and social life. Explore the ruins of temples, basilicas, and government buildings, imagining the bustling activity that once filled this central hub. Viewing the Forum from the outside is free, allowing you to soak in the atmosphere without entry fees.",
            location: 'Roman Forum',
            isValid: true,
          },
        ],
      },
      {
        day: 2,
        activities: [
          {
            activity:
              'Visit the Pantheon, a remarkably preserved ancient Roman temple, now a church, known for its stunning dome and oculus. Admire the architectural genius of this ancient structure and marvel at the light streaming through the oculus. Entry is free, making it an ideal budget-friendly activity.',
            location: 'Pantheon',
            isValid: true,
          },
          {
            activity:
              'Toss a coin into the Trevi Fountain, one of the most famous fountains in the world. Legend says that throwing a coin guarantees a return to Rome. Appreciate the Baroque artistry and the lively atmosphere surrounding the fountain. Enjoy the spectacle without spending any money.',
            location: 'Trevi Fountain',
            isValid: true,
          },
        ],
      },
      {
        day: 3,
        activities: [
          {
            activity:
              "Explore Piazza Navona, a vibrant public square built on the site of an ancient stadium. Admire the stunning Baroque architecture, including Bernini's Fountain of Four Rivers. Soak in the atmosphere of street performers and artists. Enjoying the square and its artistry is free.",
            location: 'Piazza Navona',
            isValid: true,
          },
          {
            activity:
              "Walk across Ponte Sant'Angelo, a beautiful bridge adorned with angel statues, leading to Castel Sant'Angelo. Admire the intricate details of the sculptures and enjoy the picturesque views of the Tiber River. The bridge is free to cross and enjoy.",
            location: "Ponte Sant'Angelo",
            isValid: true,
          },
        ],
      },
      {
        day: 4,
        activities: [
          {
            activity:
              "Visit St. Peter's Square, the grand plaza in front of St. Peter's Basilica in Vatican City. Admire the impressive colonnades and obelisk, and soak in the atmosphere of this important religious site. Enjoy the architectural beauty without spending money.",
            location: "St. Peter's Square",
            isValid: true,
          },
          {
            activity:
              "Explore the exterior of St. Peter's Basilica, one of the holiest sites in Christendom. Marvel at its immense size and intricate details. Entry to the Basilica is often free (though lines can be long), but this allows you to admire the facade.",
            location: "St. Peter's Basilica",
            isValid: true,
          },
        ],
      },
      {
        day: 5,
        activities: [
          {
            activity:
              'Wander through the charming neighborhood of Trastevere, known for its narrow cobblestone streets, lively atmosphere, and traditional restaurants. Explore the unique shops and soak in the authentic Roman atmosphere. Walking through the neighborhood is a free and enjoyable experience.',
            location: 'Trastevere',
            isValid: true,
          },
          {
            activity:
              'Visit the Basilica di Santa Maria in Trastevere, one of the oldest churches in Rome, known for its beautiful mosaics. Admire the stunning artwork and serene atmosphere of this historic church. Entrance to the basilica is generally free.',
            location: 'Basilica di Santa Maria in Trastevere',
            isValid: true,
          },
        ],
      },
      {
        day: 6,
        activities: [
          {
            activity:
              'Explore the Appian Way (Via Appia Antica), an ancient Roman road lined with ruins and catacombs. Walk or bike along this historic road and imagine the legions of soldiers who once marched along it. The road is generally free to access, but bicycle rental, if desired, would come from the budget.',
            location: 'Via Appia Antica',
            isValid: true,
          },
          {
            activity:
              'Visit the Catacombs of Callixtus, one of the largest and most important early Christian burial sites in Rome. While there may be a small entry fee for some catacombs, researching free or donation-based options could still allow the experience. Alternatively enjoy the grounds and surrounding area without entry.',
            location: 'Catacombs of Callixtus',
            isValid: false,
          },
        ],
      },
      {
        day: 7,
        activities: [
          {
            activity:
              'Explore the Borghese Gardens, a beautiful park with sculptures and fountains (though access to the Gallery itself requires pre-booked and potentially expensive tickets). Enjoy a leisurely stroll through the gardens, admire the surrounding scenery and enjoy the free open spaces, observing the Roman lifestyle.',
            location: 'Borghese Gardens',
            isValid: true,
          },
          {
            activity:
              'Visit Piazza del Popolo, a large public square with an obelisk and two twin churches. Enjoy the architectural marvels and soak in the lively atmosphere. Walk around and take in the views from different angles, which is a free activity.',
            location: 'Piazza del Popolo',
            isValid: true,
          },
        ],
      },
      {
        day: 8,
        activities: [
          {
            activity:
              'Enjoy a final stroll through the city, revisiting your favorite spots and taking in the atmosphere of Rome. Reflect on the history, art, and culture you have experienced during your trip. Simply walking and absorbing the city is a cost-free pleasure.',
            location: 'Rome City Centre',
            isValid: true,
          },
          {
            activity:
              'Visit the Spanish Steps, a monumental stairway connecting Piazza di Spagna with Piazza Trinità dei Monti. Climb the steps for panoramic views of the city. Enjoy the bustling atmosphere and soak in the Roman ambiance. Spending time on the steps is free.',
            location: 'Spanish Steps',
            isValid: true,
          },
        ],
      },
    ],
  },
  isOpenToJoin: true,
};

enum Step {
  DESTINATION_PICK,
  BASIC_FILTERS,
  ADVANCED_FILTERS,
  MATCHMAKING_RESULTS,
}

const JoinTripForm: FC = () => {
  const form = useValidatedForm(joinTripSchema);
  const [step, setStep] = useState<Step>(Step.DESTINATION_PICK);
  const [results, setResults] = useState<Trip[]>([]);
  const {trigger, isLoading: isResultsLoading} = useMutation(getMatches);
  const onContinue = useCallback(() => setStep(step => step + 1), []);
  const onReturn = useCallback(() => setStep(step => Math.max(step - 1, Step.DESTINATION_PICK)), []);

  const onSearch = async (filters: JoinTripSchemaType) => {
    toast.success('Filters submitted!');

    const results = await trigger({
      ...filters,
      dietaryPreferences: filters.dietaryPreferences as string[],
      gender: filters.gender as string[],
    });
    setResults(results);
    setStep(Step.MATCHMAKING_RESULTS);
  };

  const steps: Record<Step, ReactNode> = {
    [Step.DESTINATION_PICK]: <DestinationStep onContinue={onContinue} />,
    [Step.BASIC_FILTERS]: <BasicFiltersStep onContinue={onContinue} onReturn={onReturn} />,
    [Step.ADVANCED_FILTERS]: (
      <AdvancedFiltersStep
        isSearching={isResultsLoading}
        onContinue={form.handleSubmit(onSearch)}
        onReturn={onReturn}
      />
    ),
    [Step.MATCHMAKING_RESULTS]: <MatchmakingResultsStep results={results} onReturn={onReturn} />,
  };

  // TODO: remove the button
  return <FormProvider {...form}>{steps[step]}</FormProvider>;
};

export default JoinTripForm;
