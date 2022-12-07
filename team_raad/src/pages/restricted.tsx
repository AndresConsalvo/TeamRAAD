import { NextPage } from "next";
import { useSession } from "next-auth/react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  Text,
} from "@chakra-ui/react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useRef, useState } from "react";
import { FaLocationArrow, FaTimes } from 'react-icons/fa'

const centuryTower = { lat: 29.649048, lng: -82.343272 };

const Page: NextPage = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBdmozyL7FKKpLdhkA9HmE9nEDpHf5FEhI",
    libraries: ["places"],
  });
  // console.log("AQUI", isLoaded)
  const [map, setMap] = useState(null);
  const [distance, setDistance] = useState("");
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [duration, setDuration] = useState("");

  const originRef = useRef()
  const destinationRef = useRef()

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const calculateRoute = async () =>{
    if(originRef?.current?.value === '' || destinationRef.current.value === '') { return }
    
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: google.maps.TravelMode.DRIVING,
    })
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text)
  }

  const clearRoute = () => {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    originRef.current.value = ''
    destinationRef.current.value = ''

  }

  return (
    <main>
      <Flex
        position="relative"
        flexDirection="column"
        alignItems="center"
        h="100vh"
        w="100vw"
      >
        <Box position='absolute' left={0} top={0} h="100%" w="100%">
          <GoogleMap
            center={centuryTower}
            zoom={15}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            options={{
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
            onLoad={(map) => setMap(map)}
          >
            <Marker position={centuryTower} />
            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}
          </GoogleMap>
        </Box>
        <Box
        p={4}
        borderRadius='lg'
        m={4}
        bgColor='white'
        shadow='base'
        minW='container.md'
        zIndex='1'
      >
        <HStack spacing={2} justifyContent='space-between'>
          <Box flexGrow={1}>
            <Autocomplete>
              <Input type='text' placeholder='Origin' ref={originRef} />
            </Autocomplete>
          </Box>
          <Box flexGrow={1}>
            <Autocomplete>
              <Input
                type='text'
                placeholder='Destination'
                ref={destinationRef}
              />
            </Autocomplete>
          </Box>

          <ButtonGroup>
            <Button colorScheme='pink' type='submit' onClick={calculateRoute}>
              Calculate Route
            </Button>
            <IconButton
              aria-label='center back'
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent='space-between'>
          <Text>Distance: {distance} </Text>
          <Text>Duration: {duration} </Text>
          <IconButton
            aria-label='center back'
            icon={<FaLocationArrow />}
            isRound
            onClick={() => {
              map.panTo(center)
              map.setZoom(15)
            }}
          />
        </HStack>
      </Box>
      </Flex>
    </main>
  );
};

const Username: React.FC = () => {
  const { data: sessionData } = useSession();
  console.log(sessionData);
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {sessionData && (
        <p className="text-2xl">Logged in as {sessionData?.user?.name}</p>
      )}
    </div>
  );
};

export default Page;
