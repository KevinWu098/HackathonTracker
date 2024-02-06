import React from 'react'
import {SignUp} from '@clerk/nextjs'
import {Box, Paper, Typography, Link, Stack} from '@mui/material'
import Image from 'next/image'

const SignupPage = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column', // Set the main container to stack children vertically
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#eaeff1',
      }}
    >
      {/* Logo that acts as a 'Go Back' link */}
      <Link href="/" sx={{textDecoration: 'none', alignSelf: 'center', mb: 4}}>
        <Typography
          variant="h4" // Slightly larger variant for the top-centered logo
          component="h1"
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
          }}
        >
          HackathonTracker
        </Typography>
      </Link>

      <Paper
        elevation={6}
        sx={{
          display: 'flex',
          flexDirection: {xs: 'column', sm: 'row'},
          alignItems: 'center',
          justifyContent: 'center',
          padding: {xs: 2, sm: 4},
          borderRadius: 4,
          backgroundColor: '#fff',
          width: '100%',
          maxWidth: '900px',
        }}
      >
        <Stack
          width="80%"
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {/* Image */}
          <Image
            src={'/hackathon.webp'}
            alt="Hackathon Theme"
            width={200}
            height={200}
            layout="intrinsic"
          />

          {/* Sign-In Form */}
          <Box sx={{width: '100%', maxWidth: '400px'}}>
            <SignUp />
          </Box>
        </Stack>
      </Paper>
    </Box>
  )
}

export default SignupPage
